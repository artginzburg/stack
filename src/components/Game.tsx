import { Debug, Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { memo, useMemo, useRef, useState } from 'react';
import { Box3, Mesh, Vector2, Vector3 } from 'three';
import { useEventListener, useLocalStorage } from 'usehooks-ts';

import { useTheme } from '../contexts/ThemeContext';
import { ComboConfig, getNewSizeAndPositionOnComboStreak } from '../features/combos';
import { useStatistics } from '../features/stats';
import { themes } from '../features/themes';
import { config, magicValues } from '../shared/constants';
import { LocalStorageKeys } from '../shared/LocalStorageKeys';
import { round } from '../tools/round';
import { BaseTile } from './BaseTile';
import { CameraController } from './CameraController';
import { ConditionalWrapper } from './ConditionalWrapper';
import { DirLight } from './DirLight';
import { FadingTiles } from './FadingTile';
import { GameEnding } from './GameEnding';
import { Greeting } from './Greeting';
import { MovingTile } from './MovingTile';
import { PerfectEffectProps, PerfectEffects } from './PerfectEffect';
import { Score } from './Score';
import { ReactTile, TileProps } from './Tile';
import { PreviousTile } from './types';
import { useInitVisitInSession } from '../features/firstVisitInSession';
import { useMinimumActionInterval } from '../hooks/useMinimumActionInterval';

const gameConfig = {
  physics: {
    gravityDown: 600,
    /**
     * a.k.a. `restitution`
     *
     * @default 0
     */
    bounciness: 0.1,
  },
} as const;

export function Game({ autoplay }: { autoplay?: boolean }) {
  const { theme, setThemeName } = useTheme();

  const { invertGravity, speedOfMovingTile, debugPhysics } = useControls({
    invertGravity: false,
    speedOfMovingTile: {
      /** So that the interval between perfect taps is 800ms, like in the original game. */
      value: 160,
      step: 1,
    },
    debugPhysics: {
      label: 'Debug Physics',
      value: false,
    },
    theme: {
      value: theme.name,
      onChange: setThemeName,
      options: themes.map((themeEl) => themeEl.name),
    },
  });

  const {
    thisGameStats,
    globalStats,

    updateAllStatsOnCutBox,
    updateAllStatsOnGameStart,
    updateAllStatsOnLose,
    updateAllStatsOnBeatingHighScore,

    resetThisGameStats,
  } = useStatistics();
  useInitVisitInSession();

  const debug = window.location.search.includes('debug');

  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [index, setIndex] = useState(0);
  const [highScore, setHighScore] = useLocalStorage(LocalStorageKeys.HighScore, index);
  const [isHighScoreNew, setIsHighScoreNew] = useState(false);
  if (index > highScore) {
    // TODO! don't update in render (https://reactjs.org/link/setstate-in-render)
    // Can be tested by removing `highScore` localStorage entry, dropping the box once, and looking in the console. It will have a related warning with a stack trace pointing here.
    if (!isHighScoreNew) {
      setIsHighScoreNew(true);
      updateAllStatsOnBeatingHighScore();
    }
    setHighScore(index);
  }
  const defaultPreviousTile: PreviousTile = useMemo(
    () => ({
      size: new Vector2(100, 100),
      position: new Vector3(),
    }),
    [],
  );
  const [staticTiles, setStaticTiles] = useState<TileProps[]>([]);
  const [fadingTiles, setFadingTiles] = useState<TileProps[]>([]);
  const [effects, setEffects] = useState<PerfectEffectProps[]>([]);

  const movingTileMeshRef = useRef<Mesh>(null);

  const previousTile = staticTiles.at(-1) ?? defaultPreviousTile;

  //#region Performance Optimization — prevents rendering old tiles.
  // TODO render only visible tiles, and zoom out smoothly on game end so that the player would not wait too see the full zoom out, so that his device is not overloaded with the rendering. Currently, on game end, all the tiles that were hidden become visible, which can put a great deal of stress on the user's device if his score is very high like 5000.
  const shouldSliceForOptimization = isStarted && !isEnded;
  /**
   * I'm letting this much show because some users may play from a device like iPad Pro 12.9", in that mode when the screen is split between two applications, and that's when even 30 tiles would not be enough.
   *
   * It does not really matter how much if it's less than 100, because most devices today can hold up to 1000 tiles rendered simultaneously.
   */
  const howMuchToShowAfterCroppingForOptimization = 40;
  const staticTilesPossiblySliced = shouldSliceForOptimization
    ? staticTiles.slice(-howMuchToShowAfterCroppingForOptimization)
    : staticTiles;
  const fadingTilesPossiblySliced = shouldSliceForOptimization
    ? fadingTiles.slice(-howMuchToShowAfterCroppingForOptimization)
    : fadingTiles;
  /** @todo Probably, the effects would not suffer if they're always sliced, no matter the game condition. But slicing them is overall not necessary, since the old ones are filtered out inside the `PerfectEffects` function later. */
  const effectsPossiblySliced = shouldSliceForOptimization
    ? effects.slice(-howMuchToShowAfterCroppingForOptimization)
    : effects;
  //#endregion

  function cutBox() {
    if (!movingTileMeshRef.current) return;

    // calculate previous and current tiles centers
    const currentTile = new Box3().setFromObject(movingTileMeshRef.current);
    const currentCenter = new Vector3();
    movingTileMeshRef.current.localToWorld(currentCenter);
    currentTile.getCenter(currentCenter);

    // get vectors difference
    const diff = currentCenter.clone().sub(previousTile.position);

    const absDiffX = round(Math.abs(diff.x), 14); // JS messes up floating point calculation, which results in `x` or `z` being e.g. 3.552713678800501e-15 instead of 0. If it is not zero when it should be, the box will spawn in a physically impossible position and start glitching, or spawn one-sided. That's why I'm rounding to a precision that a human would not distinguish, but which rounds values really close to 0 to plain 0.
    const absDiffZ = round(Math.abs(diff.z), 14);

    const newSize = previousTile.size.clone();
    newSize.x -= absDiffX;
    newSize.y -= absDiffZ;

    if (newSize.x < 0 || newSize.y < 0) {
      lose();

      setFadingTiles((prev) => {
        if (!movingTileMeshRef.current) return prev;
        return [
          ...prev,
          {
            position: movingTileMeshRef.current.position,
            size: previousTile.size,
            index,
          },
        ];
      });
      return;
    }

    // calculate absolute error
    const errorX = absDiffX / previousTile.size.x;
    const errorZ = absDiffZ / previousTile.size.y;

    const errorPercentage = errorX + errorZ;

    /** if error is less than arbitrary epsilon than don't cut the tile at all */
    const eps = 0.05;
    const isConsideredPerfect = errorPercentage <= eps;
    if (isConsideredPerfect) {
      diff.x = 0;
      diff.z = 0;
      newSize.x += absDiffX;
      newSize.y += absDiffZ;

      spawnEffect(previousTile.position, previousTile.size);
    } else {
      const cutSizeX = previousTile.size.x - newSize.x;
      const cutSizeZ = previousTile.size.y - newSize.y;

      const signX = currentCenter.x - previousTile.position.x < 0 ? -1 : 1;
      const signZ = currentCenter.z - previousTile.position.z < 0 ? -1 : 1;

      const position = new Vector3(
        cutSizeX ? currentCenter.x + (signX * newSize.x) / 2 : previousTile.position.x,
        previousTile.position.y + config.tileHeight,
        cutSizeZ ? currentCenter.z + (signZ * newSize.y) / 2 : previousTile.position.z,
      );

      setFadingTiles((prev) => [
        ...prev,
        // Cut tile
        {
          position,
          size: new Vector2(cutSizeX || previousTile.size.x, cutSizeZ || previousTile.size.y),
          index,
        },
      ]);
    }

    const newCenter = new Vector3(
      previousTile.position.x + diff.x / 2,
      previousTile.position.y + config.tileHeight,
      previousTile.position.z + diff.z / 2,
    );

    const newStaticTile: TileProps = {
      position: newCenter,
      size: newSize,
      index,
    };

    /** "possibly" since it is not confirmed until `isConsideredPerfect` is checked. */
    const possiblyNewCurrentCombo = thisGameStats.currentCombo + 1;
    const isComboStreak =
      isConsideredPerfect && possiblyNewCurrentCombo > ComboConfig.streak.startAfter;
    const newOrEnlargedStaticTile: TileProps = isComboStreak
      ? {
          ...newStaticTile,
          ...getNewSizeAndPositionOnComboStreak(defaultPreviousTile, newStaticTile),
          createdAt: Date.now(),
        }
      : newStaticTile;

    setStaticTiles((prev) => [...prev, newOrEnlargedStaticTile]);

    updateAllStatsOnCutBox(errorPercentage, isConsideredPerfect);
  }

  function moveUp() {
    setIndex((prev) => prev + 1);
  }

  function spawnEffect(position: Vector3, size: Vector2) {
    const newCurrentCombo = thisGameStats.currentCombo + 1;
    setEffects((prev) => [
      ...prev,
      {
        position,
        size,
        materialOpacity: 1,
        currentCombo: newCurrentCombo,
      },
    ]);
  }

  function lose() {
    setIsEnded(true);
    setIndex((prev) => prev - 1);
    updateAllStatsOnLose();
  }

  function reset() {
    setIsEnded(false);
    setIsStarted(false);
    setIndex(0);
    setFadingTiles([]);
    setStaticTiles([]);
    setEffects([]);
    setIsHighScoreNew(false);
    resetThisGameStats();
  }

  const { preventActionOrPrepareAndContinue } = useMinimumActionInterval(50);

  function act() {
    if (preventActionOrPrepareAndContinue()) return;

    if (isEnded) {
      reset();
      return;
    }
    if (!isStarted) {
      setIsStarted(true);
      updateAllStatsOnGameStart();
      return;
    }
    cutBox();
    moveUp();
  }

  useEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.code === 'Space') {
      act();
    }
  });

  return (
    <div style={{ height: '100vh' }}>
      <Canvas
        gl={{ antialias: false, alpha: false }} //* Disabling antialias is visible if you look closely. Think about returning it. Or making it configurable? But it seems that in the original game, antialias is disabled, and I want to match it as much as possible, so it's probably fine to leave it like that.
        camera={{
          near: 1,
          position: [-250, 250 + magicValues.pointOfViewFix, -250],
        }}
        orthographic
        // dpr={0.7}
        {...(autoplay
          ? {
              onClick: act,
            }
          : {
              onPointerDown: act,
            })}
        shadows="basic"
      >
        <color attach="background" args={[autoplay ? '#1f0014' : theme.background(index)]} />
        <CameraController
          previousTile={previousTile}
          isStarted={isStarted}
          isEnded={isEnded}
          index={index}
        />
        <ambientLight color="#ccc" intensity={0.9} />
        <DirLight previousTile={previousTile} />
        {isStarted && !isEnded && (
          <MovingTile
            index={index}
            movingTileMeshRef={movingTileMeshRef}
            previousTile={previousTile}
            autoplay={autoplay}
            lastCube={staticTiles.at(-1)}
            speedOfMovingTile={speedOfMovingTile}
          />
        )}
        <Physics
          gravity={[
            0,
            invertGravity ? gameConfig.physics.gravityDown : -gameConfig.physics.gravityDown,
            0,
          ]}
          defaultContactMaterial={{
            restitution: gameConfig.physics.bounciness,
          }}
        >
          <ConditionalWrapper condition={debugPhysics} Wrapper={Debug}>
            <BaseTile />
            {staticTilesPossiblySliced.map((tile, tileArrIndex) => (
              <ReactTile
                key={tile.index}
                {...tile}
                prevSize={staticTilesPossiblySliced[tileArrIndex - 1]?.size}
              />
            ))}
            <FadingTiles fadingTiles={fadingTilesPossiblySliced} />
          </ConditionalWrapper>
        </Physics>
        <PerfectEffects effects={effectsPossiblySliced} setEffects={setEffects} />
        {debug && <OrbitControls target={previousTile.position} />}
        {/* TODO think about pre-loading everything. In reality, I suppose, it just makes all the objects wait for each other to finish loading before starting the scene and rendering. This makes the BaseTile look like it does not flash on load, but adds a significant amount of time to the first appearance of all of the Canvas. */}
        {/* <Preload all /> */}
      </Canvas>
      <Greeting index={index} isStarted={isStarted} />
      <Score index={index} isEnded={isEnded} />
      <GameEndingMemoized
        isStarted={isStarted}
        isEnded={isEnded}
        isHighScoreNew={isHighScoreNew}
        thisGameStats={thisGameStats}
        globalStats={globalStats}
      />
    </div>
  );
}

const GameEndingMemoized = memo(GameEnding);

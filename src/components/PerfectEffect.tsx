import { Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Fragment } from 'react';
import { BackSide, Vector2, Vector3 } from 'three';

import { useTheme } from '../contexts/ThemeContext';
import { ComboConfig } from '../features/combos';
import { config } from '../shared/constants';
import { easeInOutSineEaseOutCirc } from '../tools/easing';
import { PlaneBorder } from './PlaneBorder';

/** @todo easing for the effect fade out */
const perfectEffectConfig = {
  /** was `5` in the first version of the remake */
  borderWidth: 4,
  /** was `2` in the first version of the remake */
  animationSpeed: 0.7,
} as const;

export function PerfectEffects({
  effects,
  setEffects,
}: {
  effects: PerfectEffectProps[];
  setEffects: React.Dispatch<React.SetStateAction<PerfectEffectProps[]>>;
}) {
  useFrame((state, delta) => {
    setEffects((prev) =>
      prev
        .map((effect) =>
          effect.materialOpacity < 0
            ? (null as any)
            : {
                ...effect,
                materialOpacity:
                  effect.materialOpacity - delta * perfectEffectConfig.animationSpeed,
              },
        )
        .filter(Boolean),
    );
  });

  return (
    <>
      {effects.map((effect) => (
        <Fragment key={effect.position.y}>
          <PerfectEffect {...effect} />
          <ComboEffect {...effect} />
        </Fragment>
      ))}
    </>
  );
}

export interface PerfectEffectProps {
  position: Vector3;
  size: Vector2;
  materialOpacity: number;
  currentCombo: number;
}
function PerfectEffect({ position, size, materialOpacity }: PerfectEffectProps) {
  const { theme } = useTheme();

  if (materialOpacity <= 0) {
    return null;
  }

  const addedSize = perfectEffectConfig.borderWidth * 2;

  return (
    <Plane
      args={[size.x + addedSize, size.y + addedSize]}
      position={[position.x, position.y - config.tileHeight / 2, position.z]}
      rotation-x={Math.PI / 2}
    >
      <meshBasicMaterial
        color={theme.lightElements}
        side={BackSide}
        transparent
        opacity={materialOpacity}
      />
    </Plane>
  );
}

/** @todo exclude into a separate file. */
function ComboEffect({ position, size, materialOpacity, currentCombo }: PerfectEffectProps) {
  const { theme } = useTheme();

  if (materialOpacity <= 0) {
    return null;
  }

  if (currentCombo < ComboConfig.effect.startAt || currentCombo > ComboConfig.effect.endAt) {
    return null;
  }

  const currentComboEffectStage = currentCombo - (ComboConfig.effect.startAt - 1);

  const stagesIncludingAllPreviousAndCurrent = [...Array(currentComboEffectStage)].map(
    (el, i) => i + 1,
  );

  return (
    <>
      {stagesIncludingAllPreviousAndCurrent.map((stage) => {
        /**
         * If decreased — the delay between stages will increase.
         * @todo choose a better name for this variable.
         */
        const speedOfDelayBetweenStages = 10;
        const delayFactor = (1 + speedOfDelayBetweenStages) / (stage + speedOfDelayBetweenStages);

        /** takes the largest side as max. */
        const maxAddedSize = size.x > size.y ? size.x : size.y;

        const addedSize =
          maxAddedSize * easeInOutSineEaseOutCirc(1 - materialOpacity / delayFactor);

        if (Number.isNaN(addedSize)) {
          // In this case, the stage should not be displayed at all, because it's delayed. If this check were to be uncommented — there would be errors in console.
          return null;
        }

        const comboEffectWidth = (perfectEffectConfig.borderWidth * 2) / stage;

        const preventTextureOverlayGlitch = stage * 0.01;

        return (
          <PlaneBorder
            renderOrder={stage} // setting `renderOrder` to specify how the semi-transparent meshes should blend. Without this, they will blend in a way determined by the actual planes order inside PlaneBorder (which looks strange physics-wise), whilst I want them to blend as if PlaneBorder is a single mesh. TODO make PlaneBorder a real single mesh (e.g. an instanced mesh, or a mesh with multiple geometries).
            args={[size.x + addedSize, size.y + addedSize]}
            position={[
              position.x,
              position.y - config.tileHeight / 2 + preventTextureOverlayGlitch,
              position.z,
            ]}
            rotation-x={Math.PI / 2}
            borderWidth={comboEffectWidth}
            key={stage}
          >
            <meshBasicMaterial
              color={theme.lightElements}
              side={BackSide}
              transparent
              opacity={materialOpacity}
            />
          </PlaneBorder>
        );
      })}
    </>
  );
}

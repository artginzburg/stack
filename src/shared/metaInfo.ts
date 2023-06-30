import packageJson from '../../package.json';

export const repoUrl = new URL(`https://github.com/${packageJson.repository}`);

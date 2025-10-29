import {$} from 'bun';

const repo = Bun.env.GH_REPO;

async function print(msg: string) {
  await $`echo "${msg}" | lp -d ${Bun.env.PRINTER}`
}

async function getPrComments() {
  const prs: Array<{comments: []}> = JSON.parse(await $`gh pr list --repo ${repo} --assignee "@me" --json`);
  
  
}

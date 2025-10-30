import { $ } from "bun";

const repo = Bun.env.GH_REPO;
const LINE_WIDTH = 28;

type Author = {
  login: string;
};

type Comment = {
  id: string;
  author: Author;
  authorAssociation: string;
  body: string;
  createdAt: string;
  includesCreatedEdit: boolean;
  isMinimized: boolean;
  minimizedReason: string;
  url: string;
  viewerDidAuthor: boolean;
};

async function print(msg: string) {
  // console.log(msg);
  // console.log();
  // console.log();
  // console.log();
  // console.log();
  await $`echo "${msg}" | lp -d ${Bun.env.PRINTER}`;
}

async function getPrComments() {
  return (
    await $`gh pr list --repo ${repo} --assignee "@me" --json comments`
  ).json() as Array<{ comments: Array<Comment> }>;
}

async function printPrComment(comment: Comment) {
  await print(wrapWithTitle(comment.body, "Pull Request Comment"));
}

function wrapWithTitle(title: string, content: string) {
  const titleWhitespaceBefore = " ".repeat(
    Math.floor(Math.max(LINE_WIDTH - title.length, 0) / 2),
  );
  const titleWhitespaceAfter = " ".repeat(
    Math.max(LINE_WIDTH - titleWhitespaceBefore.length - title.length, 0),
  );
  return (
    fillLine("=") +
    titleWhitespaceBefore +
    fillLine() +
    title +
    titleWhitespaceAfter +
    fillLine() +
    content +
    fillLine() +
    fillLine("=")
  );
  content;
}

function fillLine(filler = " ") {
  return filler.repeat(LINE_WIDTH);
}

const prs = await getPrComments();
prs
  .flatMap((pr) => {
    return pr.comments;
  })
  .slice(0, 2)
  .forEach((c) => {
    printPrComment(c);
  });

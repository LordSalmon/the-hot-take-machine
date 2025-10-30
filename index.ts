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
  const titleSection = "=".repeat(LINE_WIDTH);
  const titleWhitespaceBefore = " ".repeat(
    Math.floor((LINE_WIDTH - title.length) / 2),
  );
  const titleWhitespaceAfter = " ".repeat(
    LINE_WIDTH - titleWhitespaceBefore.length - title.length,
  );
  return (
    titleSection +
    titleWhitespaceBefore +
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
  .forEach((c) => {
    printPrComment(c);
  });

import { $ } from "bun";
import { displayPartsToString, parseJsonText } from "typescript";

const repo = Bun.env.GH_REPO;
const LINE_WIDTH = 28;

type Author = {
  login: string;
};

type PullRequest = {
  title: string | undefined;
  comments: Array<Comment>;
};

type Comment = {
  id: string;
  author: Author;
  authorAssociation: string;
  body: string | undefined;
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
  ).json() as Array<PullRequest>;
}

async function printPrComment(
  prTitle: string,
  created: string,
  comment: Comment,
) {
  await print(
    wrapWithTitle(
      "Pull Request Comment",
      fillLine() +
        center(prTitle) +
        fillLine() +
        center(created) +
        fillLine() +
        comment.body,
    ),
  );
}

function wrapWithTitle(title: string, content: string) {
  return (
    fillLine("=") +
    center(title) +
    fillLine() +
    content +
    fillUpWithSpaces(content) +
    fillLine() +
    fillLine("=")
  );
  content;
}

function center(content: string) {
  const whitespaceBefore = " ".repeat(
    Math.floor(Math.max(LINE_WIDTH - content.length, 0) / 2),
  );
  const whitespaceAfter = " ".repeat(
    Math.max(LINE_WIDTH - whitespaceBefore.length - content.length, 0),
  );
  return whitespaceBefore + content + whitespaceAfter;
}

function fillLine(filler = " ") {
  return filler.repeat(LINE_WIDTH);
}

function fillUpWithSpaces(content: string) {
  return content + " ".repeat(LINE_WIDTH - (content.length % LINE_WIDTH));
}

const prs = await getPrComments();
prs
  .reduce(
    (acc, pr) => {
      for (const comment of pr.comments) {
        acc.push({
          prTitle: pr.title ?? "",
          created: comment.createdAt,
          comment: comment,
        });
      }
      return acc;
    },
    [] as Array<{ prTitle: string; comment: Comment; created: string }>,
  )
  .sort((a, b) => {
    return a.comment.createdAt > b.comment.createdAt ? 1 : -1;
  })
  .filter((c) => c.comment.body !== undefined)
  .forEach((c) => {
    printPrComment(c.prTitle, c.created, c.comment);
  });

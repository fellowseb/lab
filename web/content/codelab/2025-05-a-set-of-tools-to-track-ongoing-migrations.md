---
tags: "experiments"
status: "on-going"
title: "A set of tools to track on-going code migrations"
resourceTags: ["Rust"]
date: 2025-05
---

## Problem

When working on a large codebase migrations can be a mouthful and take several
days, weeks or even months. I came across this situation many times during my
career but each time it was quite frustrating to have to track and report progress
manually (i.e. keep a list of migration tasks in a Word document, a JIRA/GitLab
ticket or similar). This method would ultimately lead to a stale document
because who wants to update such thing, right ? But why don't we rely more on
the code itself ?

## Specs

Create a CLI tool that:

- Lets developers create (and remove) "migration projects" to a TypeScript
  package.
- Each project can have an identifier, a description, a documentation entry that
  describes the migration steps, rationale and other technical details.
- Lets developers add annotations (custom TSDoc comments) to the code to
  identify migration items.
- The CLI will have a command to display a report in the console of the progress
  for a given project.

Additionally we will consider creating a SonarQube plugin to integrate the
migration items in the SQ report and sending those reports on a weekly basis to
Slack.

## Resources

- [The Rust Programming Language]("https://nostarch.com/rust-programming-language-2nd-edition")<br/>
  Ed.: No starch press<br/>
  ISBN: 978-1718503106<br/>
  By Steve Klabnik and Carol Nichols

- [TSDoc](https://tsdoc.org/)

## Results

N/A

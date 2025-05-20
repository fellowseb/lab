export type AppSection = "about" | "brainfuel" | "labo" | "blog";

export interface ExperimentResourceBookModel {
  type: "book";
  title: string;
  href: string;
  editor: string;
  isbn: string;
  authors: string[];
}

export interface ExperimentResourceArticleModel {
  type: "article";
  title: string;
  href: string;
  authors: string[];
}

export type ExperimentResourceModel =
  | ExperimentResourceBookModel
  | ExperimentResourceArticleModel;

export interface ExperimentResultModel {
  type: "link";
  text: string;
  href: string;
}

export type ExperimentStatusModel = "done" | "on-going" | "planned";

export interface ExperimentModel {
  slug: string;
  status: ExperimentStatusModel;
  collapsed: boolean;
  title: string;
  tags: string[];
  content: string;
  date: string;
}

export type ExperimentsModel = { [id: string]: ExperimentModel };

export interface ResourceModel {
  resourceId: string;
  title: string;
  url: string;
  tags: string[];
  authors: string[];
  thumbnail?: {
    url: string;
  };
  thumbnailHREF?: string;
  date: string;
}

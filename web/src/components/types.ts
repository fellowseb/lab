export type AppSection = "about" | "brainfuel" | "labo";

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
  id: string;
  status: ExperimentStatusModel;
  collapsed: boolean;
  title: string;
  tasks: string[];
  resources: ExperimentResourceModel[];
  results: ExperimentResultModel[];
  tags: string[];
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
}

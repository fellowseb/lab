export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("content/*/assets");
  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setOutputDirectory("public/content");
}

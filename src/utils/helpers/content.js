const shortenContent = (content, limit) =>
  typeof content === "string"
    ? content.length > limit
      ? content.slice(0, limit) + "..."
      : content
    : "";

export { shortenContent };

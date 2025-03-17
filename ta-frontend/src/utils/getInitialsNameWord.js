  const getInitialsNameWord = (name) => {
    if (!name) return "U";
    const words = name.split(" ");
    return words.length > 1
      ? words[0]?.slice(0, 1)?.toUpperCase() +
          words[1]?.slice(0, 1)?.toUpperCase()
      : words[0]?.slice(0, 2)?.toUpperCase();
  };

export default getInitialsNameWord;
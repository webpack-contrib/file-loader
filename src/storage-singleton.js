const FileLoaderStorage = (function getLoaderStorage() {
  let instance = null;

  function createFileLoaderStorage() {
    const emittedFiles = [];

    function addFileItem(outputPath, content) {
      emittedFiles.push({ outputPath, content });
    }
    return {
      emittedFiles,
      addFile: addFileItem,
    };
  }

  return {
    getStorage: function getStorage() {
      if (!instance) {
        instance = createFileLoaderStorage();
      }
      return instance;
    },
  };
}());

export default FileLoaderStorage;

(function() {
  document.getElementById("uploadBtn").onchange = function() {
    if (this.files.lenght != 0) {
      document.getElementById("uploadFile").value = this.files[0].name;
    }
  };
})();

//jshint esversion:6

exports.getDate = function() {

  const today = new Date();

  const options = {
    day: "numeric",
    month: "short",
  };

  return today.toLocaleDateString("en-US", options);

};
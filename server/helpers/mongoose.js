module.exports = {
  normalizeErrors: function(errors) {
    let newErrors = [];
    for (let keys in errors) {
      if (errors.hasOwnProperty(keys)) {
        newErrors.push({ title: keys, detail: errors[keys].message });
      }
    }

    return newErrors;
  }
};

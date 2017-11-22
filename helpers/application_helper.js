var applicationHelper = {
	toBool: function(val){
    return val.toLowerCase().trim() == 'true';
  },
  generateOTP: function () {
  	return Math.floor(1000 + Math.random() * 9000);
  }
}

module.exports = applicationHelper
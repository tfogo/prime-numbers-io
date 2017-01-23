var app = new Vue({
  el: '#app',
  data: {
    phoneNumber: '555 123 1234',
    phoneNumbers: [],
    countries: countryArr,
    loading: true,
    options: {
      isoCountry: 'US',
      areaCode: ''
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.phoneNumbers = [];
      this.loading = true;
      var self = this;
      $.get('/numbers', this.options, function(response) {
        self.phoneNumbers = response.data;
        self.loading = false;
      });
    }
  }
})

module.exports = function ( karma ) {
  karma.set({
    files: [
      <% scripts.forEach( function (file) { %>'<%= file %>',
      <% }); %>
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-spec-reporter'],
    reporters: ['spec'],
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',
    autoWatch: false,
    browsers: ['PhantomJS']
  });
};

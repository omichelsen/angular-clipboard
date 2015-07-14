# angular-clipboard

[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Copy text to clipboard by clicking a button, without using Flash. This is using the new [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) and [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) available in the latest browsers.

Browser support: Chrome 43+, Firefox 41+, Opera 29+ and IE10+.

See the [demo](https://rawgit.com/omichelsen/angular-clipboard/master/demo/demo.html).

## Install

Install using `npm` or `bower`:

```bash
$ npm install angular-clipboard --save
```
```bash
$ bower install angular-clipboard --save
```

angular-clipboard has no other dependencies than [Angular](https://angularjs.org/)
itself.

## Usage

Require angular-clipboard as a dependency for your app:

```javascript
angular.module('MyApp', ['angular-clipboard'])
    .controller('MyController', ['$scope', function ($scope) {
        $scope.textToCopy = 'I can copy by clicking!';

        $scope.success = function () {
            console.log('Copied!');
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
        };
    }]);
```

Copy text from an input field by clicking a button:

```html
<input type="text" ng-model="textToCopy">
<button clipboard text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>
```

You can supply a method to be called for the `on-copied` and `on-error` event. The `on-error` function will be called with the error object as argument `err`.

[travis-image]: https://img.shields.io/travis/omichelsen/angular-clipboard/master.svg
[travis-url]: https://travis-ci.org/omichelsen/angular-clipboard
[coveralls-image]: https://img.shields.io/coveralls/omichelsen/angular-clipboard/master.svg
[coveralls-url]: https://coveralls.io/r/omichelsen/angular-clipboard?branch=master
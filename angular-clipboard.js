(function (root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('angular'));
    } else {
        root.angularClipboard = factory(root.angular);
  }
}(this, function (angular) {

return angular.module('angular-clipboard', [])
    .provider('angularClipboard', function () {
        this.options = {
            onCopiedDefaultCallback: false,
            onErrorDefaultCallback: false
        };
        this.configure = function (options) {
            angular.extend(this.options, options);
        };
        this.$get = function() {
            return {
                defaultOnCopied: this.options.onCopiedDefaultCallback,
                defaultOnError: this.options.onErrorDefaultCallback,
            };
        };
        return this;
    })
    .factory('clipboard', ['$document', '$window', function ($document, $window) {
        function createNode(text, context) {
            var node = $document[0].createElement('textarea');
            node.style.position = 'absolute';
            node.textContent = text;
            node.style.left = '-10000px';
            node.style.top = ($window.pageYOffset || $document[0].documentElement.scrollTop) + 'px';
            return node;
        }

        function copyNode(node) {
            try {
                // Set inline style to override css styles
                $document[0].body.style.webkitUserSelect = 'initial';

                var selection = $document[0].getSelection();
                selection.removeAllRanges();
                node.select();

                if(!$document[0].execCommand('copy')) {
                    throw('failure copy');
                }
                selection.removeAllRanges();
            } finally {
                // Reset inline style
                $document[0].body.style.webkitUserSelect = '';
            }
        }

        function copyText(text, context) {
            var node = createNode(text, context);
            $document[0].body.appendChild(node);
            copyNode(node);
            $document[0].body.removeChild(node);
        }

        return {
            copyText: copyText,
            supported: 'queryCommandSupported' in $document[0] && $document[0].queryCommandSupported('copy')
        };
    }])
    .directive('clipboard', ['clipboard', 'angularClipboard', function (clipboard, angularClipboardProvider) {
        return {
            restrict: 'A',
            scope: {
                onCopied: '&?',
                onError: '&?',
                text: '=',
                supported: '=?'
            },
            link: function (scope, element) {
                scope.supported = clipboard.supported;

                var onCopiedCallback = false;
                if (angular.isFunction(scope.onCopied)) {
                    onCopiedCallback = scope.onCopied;
                } else if (angular.isFunction(angularClipboardProvider.defaultOnCopied)) {
                    onCopiedCallback = angularClipboardProvider.defaultOnCopied;
                }

                var onErrorCallback = false;
                if (angular.isFunction(scope.onError)) {
                    onErrorCallback = scope.onError;
                } else if (angular.isFunction(angularClipboardProvider.defaultOnError)) {
                    onErrorCallback = angularClipboardProvider.defaultOnError;
                }

                element.on('click', function (event) {
                    try {
                        clipboard.copyText(scope.text, element[0]);
                        if (onCopiedCallback) {
                            scope.$evalAsync(onCopiedCallback());
                        }
                    } catch (err) {
                        if (onErrorCallback) {
                            scope.$evalAsync(onErrorCallback(err));
                        }
                    }
                });
            }
        };
    }]);

}));

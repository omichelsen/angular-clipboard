(function (angular) {
	
	var angularModule = angular.module('angular-clipboard', [])
	    .factory('clipboard', ['$document', function ($document) {
	        function createNode(text) {
	            var node = $document[0].createElement('textarea');
	            node.style.position = 'absolute';
	            node.style.left = '-10000px';
	            node.textContent = text;
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
	
	        function copyText(text) {
	            var node = createNode(text);
	            $document[0].body.appendChild(node);
	            copyNode(node);
	            $document[0].body.removeChild(node);
	        }
	
	        return {
	            copyText: copyText
	        };
	    }])
	    .directive('clipboard', ['clipboard', function (clipboard) {
	        return {
	            restrict: 'A',
	            scope: {
	                onCopied: '&',
	                onError: '&',
	                text: '='
	            },
	            link: function (scope, element) {
	                element.on('click', function (event) {
	                    try {
	                        clipboard.copyText(scope.text);
	                        if (angular.isFunction(scope.onCopied)) {
	                            scope.$evalAsync(scope.onCopied());
	                        }
	                    } catch (err) {
	                        if (angular.isFunction(scope.onError)) {
	                            scope.$evalAsync(scope.onError({err: err}));
	                        }
	                    }
	                });
	            }
	        };
	    }]);

	if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
		module.exports = angularModule;
	}
	
})(angular);


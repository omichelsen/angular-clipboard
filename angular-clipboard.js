angular.module('angular-clipboard', [])
    .directive('clipboard', ['$document', '$window', function ($document, $window) {
        return {
            restrict: 'A',
            scope: {
                onCopied: '&',
                onError: '&',
                text: '='
            },
            link: function (scope, element, attrs) {
                function createNode(text) {
                    var node = $document[0].createElement('textarea');
                    node.style.position = 'absolute';
                    node.style.left = '-10000px';
                    node.textContent = text;
                    return node;
                }

                function copyNode(node) {
                    // Set inline style to override css styles
                    $document[0].body.style.webkitUserSelect = 'initial';

                    var selection = $document[0].getSelection();
                    selection.removeAllRanges();
                    node.select();

                    if (!$document[0].execCommand('copy')) {
                        throw ('failure copy');
                    }
                    selection.removeAllRanges();

                    // Reset inline style
                    $document[0].body.style.webkitUserSelect = '';
                }

                function copyText(text) {
                    var node = createNode(text);
                    $document[0].body.appendChild(node);
                    copyNode(node);
                    $document[0].body.removeChild(node);
                }

                function startCopy() {
                    try {
                        copyText(scope.text);
                        if (angular.isFunction(scope.onCopied)) {
                            scope.$evalAsync(scope.onCopied());
                        }
                    } catch (err) {
                        if (angular.isFunction(scope.onError)) {
                            scope.$evalAsync(scope.onError({ err: err }));
                        }
                    }
                }

                function setupClick() {
                    element.on('click', function (event) {
                        startCopy();
                    });
                }

                function setupCtrlC() {
                    var ctrlDown = false;
                    var ctrlKey = 17;
                    var cKey = 67;

                    // returns true if there is selected text, false otherwise
                    // see http://stackoverflow.com/a/5379408 for more info
                    function selectedText() {
                        var text = "";
                        if ($window.getSelection) {
                            text = $window.getSelection().toString();
                        } else if ($document.selection && $document.selection.type != "Control") {
                            text = $document.selection.createRange().text;
                        }
                        return text;
                    }

                    // This is necessary to allow event focus on the element
                    element.attr('tabindex', "0");

                    element.bind("keydown", function ($event) {
                        if (ctrlDown && ($event.keyCode == cKey)) {
                            if (!selectedText()) {
                                startCopy();
                            }
                        }
                    });

                    // Listen for key up on the window instead of the element, 
                    // in case someone presses ctrlDown then clicks on another element
                    angular.element($document).bind("keyup", function ($event) {
                        if ($event.keyCode == ctrlKey) {
                            ctrlDown = false;
                        }
                    });

                    element.bind("keydown", function ($event) {
                        if ($event.keyCode == ctrlKey) {
                            ctrlDown = true;
                            //console.log("ctrl down");
                        }
                    });
                }

                // add event listeners
                if ("ctrlC" in attrs) {
                    setupCtrlC();
                } else {
                    setupClick();
                }
            }
        };
    }]);

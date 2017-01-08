describe('angular-clipboard', function () {
    var elm, scope;

    beforeEach(angular.mock.module('angular-clipboard'));

    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        scope = $rootScope;
        elm = $compile('<button clipboard supported="supported" text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>')(scope);

        scope.supported = undefined;
        scope.textToCopy = 'Copy me!';
        scope.copied = false;
        scope.success = function () {scope.copied = true;};
        scope.fail = function (err) {};
        scope.$digest();

        spyOn(scope, 'success').and.callThrough();
        spyOn(scope, 'fail');
    }));

    it('should invoke success callback after successful execCommand', function () {
        spyOn(document, 'execCommand').and.returnValue(true);
        elm.triggerHandler('click');
        expect(scope.success).toHaveBeenCalled();
    });

    it('should invoke fail callback on error in execCommand', function () {
        spyOn(document, 'execCommand').and.returnValue(false);
        elm.triggerHandler('click');
        expect(scope.fail).toHaveBeenCalledWith('failure copy');
    });

    it('should invoke fail callback on invalid child element', function () {
        spyOn(document.body, 'appendChild').and.throwError('fake');
        elm.triggerHandler('click');
        expect(scope.fail).toHaveBeenCalled();
    });

    it('should be caught by angular\'s digest cycle', function () {
        spyOn(document, 'execCommand').and.returnValue(true);
        elm.triggerHandler('click');
        expect(scope.copied).toEqual(true);
    });

    it('should export/return angular module', function () {
        expect(window.angularClipboard).toBeDefined();
        expect(window.angularClipboard.name).toEqual('angular-clipboard');
    });

    it('should feature detect and set supported', function () {
        expect(scope.supported).toEqual(true);
    });

});

describe('provider', function() {
        var provider;
        
        /*beforeEach(inject(function (angularClipboard) {
            provider = angularClipboard;
        }));*/

        beforeEach(function(){
            var fakeModule = angular.module('test.app.config', function () {});
            fakeModule.config( function (angularClipboardProvider) {
                provider = angularClipboardProvider;
            });
            // Initialize test.app injector
            module('angular-clipboard', 'test.app.config');

            // Kickstart the injectors previously registered 
            // with calls to angular.mock.module
            inject(function () {});
        });

        beforeEach(angular.mock.inject(function ($rootScope, $compile) {
            scope = $rootScope;
            elm = $compile('<button clipboard text="textToCopy">Copy</button>')(scope);

            scope.textToCopy = 'Copy me!';
            scope.$digest();

        }));

        describe('with custom configuration', function () {
            it('set default success/error callbacks', function () {
                // check sanity
                expect(provider).not.toBeUndefined();
                // configure the provider
                var successCallback = function() {scope.defaultSuccessCallback = true};
                var errorCallback = function() {scope.defaultErrorCallback = true};
                var obj = {
                    success : successCallback,
                    error: errorCallback
                }
                provider.configure({
                    onCopiedDefaultCallback: obj.success,
                    onErrorDefaultCallback: obj.error
                });
                expect(provider.$get().defaultOnCopied).toEqual(obj.success);
                expect(provider.$get().defaultOnError).toEqual(obj.error);
                
                elm.triggerHandler('click');
                expect(obj.success).toEqual(true);
                expect(scope.defaultErrorCallback).toEqual(true);


            });
        });
        
        /*it('should exist', function() {
            expect(provider).toBeDefined();
        });

        it('should be configurable', function() {
            debugger;
            provider.configure({
                onCopiedDefaultCallback: function(){
                    // don't do anything
                }
            })
            //expect(provider.options).toBeDefined();
        })*/

    });

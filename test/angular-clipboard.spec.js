describe('angular-clipboard', function () {
    var elm, scope;

    beforeEach(angular.mock.module('angular-clipboard'));

    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        scope = $rootScope;
        elm = $compile('<button clipboard text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>')(scope);

        scope.textToCopy = 'Copy me!';
        scope.copied = false;
        scope.success = function () {scope.copied = true;};
        scope.fail = function (err) {};
        scope.$digest();

        spyOn(scope, 'success').and.callThrough();
        spyOn(scope, 'fail');
    }));

    it('should invoke success callback', function () {
        spyOn(document, 'execCommand').and.returnValue(true);
        elm.triggerHandler('click');
        expect(scope.success).toHaveBeenCalled();
    });

    it('should invoke fail callback', function () {
        spyOn(document.body, 'appendChild').and.throwError('fake');
        elm.triggerHandler('click');
        expect(scope.fail).toHaveBeenCalled();
    });

    it('should invoke fail callback', function () {
        spyOn(document, 'execCommand').and.returnValue(false);
        elm.triggerHandler('click');
        expect(scope.fail).toHaveBeenCalled();
    });
    
    it('should be caught by angular\'s digest cycle', function () {
        spyOn(document, 'execCommand').and.returnValue(true);
        elm.triggerHandler('click');
        expect(scope.copied).toEqual(true);
    });
});

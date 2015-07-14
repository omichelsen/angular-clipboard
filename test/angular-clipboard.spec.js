describe('angular-clipboard', function () {
    var elm, scope;

    beforeEach(angular.mock.module('angular-clipboard'));

    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        scope = $rootScope;
        elm = $compile('<button clipboard text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>')(scope);

        scope.textToCopy = "Copy me!";
        scope.success = function () {};
        scope.fail = function (err) {};
        scope.$digest();

        spyOn(scope, 'success');
        spyOn(scope, 'fail')
    }));

    it('should succeed on click', function () {
        elm.triggerHandler('click');
        expect(scope.success).toHaveBeenCalled();
    });
});
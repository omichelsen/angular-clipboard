describe('angular-clipboard', function () {
    var elm, scope, compile;

    beforeEach(angular.mock.module('angular-clipboard'));

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope;
        compile = $compile;
        elm = compile('<button clipboard text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>')(scope);

        scope.textToCopy = 'Copy me!';
        scope.copied = false;
        scope.success = function () { scope.copied = true; };
        scope.fail = function (err) { };
        scope.$digest();

        spyOn(scope, 'success').and.callThrough();
        spyOn(scope, 'fail');
    }));

    it('should invoke success callback', function () {
        console.log(scope)
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

    describe('Ctrl C', function () {
        var ctrlDownEvent, cDownEvent;
        beforeEach(function () {
            ctrlDownEvent = $.Event('keydown');
            ctrlDownEvent.which = 17;
            ctrlDownEvent.keyCode = 17;

            cDownEvent = $.Event('keydown');
            cDownEvent.which = 67;
            cDownEvent.keyCode = 67;
        });

        it("should not copy if ctrl + c is pressed without the attribute ctrl-c attribute", function () {
            $(elm).trigger(ctrlDownEvent);
            $(elm).trigger(cDownEvent);

            console.log(elm)
            expect(scope.success).not.toHaveBeenCalled();
        });

        it("should not copy if ctrl + c is pressed without the attribute ctrl-c attribute", function () {
            elm = compile('<button clipboard ctrl-c text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>')(scope);
            scope.$digest();

            $(elm).trigger(ctrlDownEvent);
            $(elm).trigger(cDownEvent);

        });
    })
});

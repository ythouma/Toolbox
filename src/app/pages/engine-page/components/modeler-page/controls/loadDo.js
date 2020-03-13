/**
 * Created by lukaj on 2017-02-10.
 */
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/loadDo.html', {encoding: 'utf-8'});

var loadDoController = function($scope){
    var vm = window['loadDo'] =this;

    vm.title = 'Titolo';
    vm.loaded = false;
    vm.struttura = {};

    vm.close = close;
    vm.load = load;

    function close(){
        console.log("close fired");
        vm.title = 'Titolo';
        vm.loaded = false;
        vm.struttura = {};
    }

    function load(struttura){
        if(struttura){
            vm.struttura = struttura;
            vm.loaded = true;
            $scope.$apply();
        }
    }
};

loadDoController.$inject = ['$scope'];

module.exports = function () {
    return {
        // scope: {
        //     struttura: '='
        // },
        scope: true,
        restrict: 'E',
        controller: loadDoController,
        controllerAs: 'vm',
        template: template
    };
};

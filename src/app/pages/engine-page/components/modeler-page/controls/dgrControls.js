'use strict';

var fs = require('fs'),
    angular = require('angular'),
    constants = require('../../../util/constants'),
    template = fs.readFileSync(__dirname + '/dgrControls.html', {encoding: 'utf-8'});

var modaltemplate = fs.readFileSync(__dirname + '/../../../modal/confirmDelete.html', {encoding: 'utf-8'});

var controller = function (projectServices, logger, $modal, formsServices) {

    var vm = window['dgrControls'] = this;

    vm.openFsProcess = openFsProcess;
    vm.newProcess = newProcess;
    vm.deployProject = deployProject;
    vm.toggleFullScreen = toggleFullScreen;
    vm.toggleZoom = toggleZoom;
    vm.togglePropertiesPanelBy = togglePropertiesPanelBy;
    vm.source = source;
    vm.switchResource = switchResource;
    vm.newResource = newResource;
    vm.preSave = preSave;
    vm.hideDetail = hideDetail;
    vm.saveCurrentProcess = saveCurrentProcess;
    vm.deleteProjectResource = deleteProjectResource;
    vm.openDelete = openDelete;
    vm.reassign = reassign;
    vm.getFormFields =  getFormFields;

    vm.workbench = vm.diagramManager.workbench;

    function hideDetail() {
        angular.element('#diagramDetail').addClass('ng-hide');
    }

    function deleteProjectResource() {
        // TODO: Decidere in un secondo momento se aggiungere un modale per la conferma
        var resourceId = vm.workbench.currentResource.resourceId;
        projectServices.deleteProjectResource(resourceId).then(function (response) {

            if (response.operationResult === 'OK') {
                if (vm.workbench.sheets.length) {
                    vm.workbench.sheets.forEach(function (item, index) {
                        if (item.active === true) {
                            if (index !== 0) {
                                vm.workbench.sheets[index - 1].active = true;
                                vm.workbench.currentResource = vm.workbench.sheets[index - 1];
                            } else {
                                vm.workbench.sheets[index + 1].active = true;
                                vm.workbench.currentResource = vm.workbench.sheets[index + 1];
                            }
                            vm.diagramManager.openProcess(vm.workbench.currentResource, true);
                            vm.workbench.sheets.splice(index, 1);
                            logger.info('Resource has been deleted successfully.');
                        }
                    });

                    for (var i in vm.workbench.resources) {
                        if (vm.workbench.resources[i].resourceId === resourceId) {
                            vm.workbench.resources.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    logger.info('Resource has been deleted successfully.');
                    setTimeout(function () {
                        window.close();
                    }, 3000);
                }
            } else {
                logger.error('Resource has not been deleted.');
            }
        });

    }

    function openDelete() {
        var modalInstance = $modal.open({
            template: modaltemplate,
            backdrop:"static",
            controller: 'confirmDelete as vm',
            resolve: {
                options: function() {
                    return {
                        header: "Delete resource",
                        content: "Do you want to delete the resource named ",
                        name: vm.workbench.currentResource.resourceName + "." + vm.workbench.currentResource.cfgResourceTypes.description,
                        endMark: "?",
                        action: function() {
                            deleteProjectResource();
                        }
                    }
                }
            }
        });

        modalInstance.result.then(function () {

        }, function (event) {
            //case event = 'backdrop-click' => do nothing
        });
    }

    function saveCurrentProcess(deploy, callback, taskId) {

        vm.diagramManager.getBpmnXml(function (err, xml) {
            vm.workbench.currentResource.resourceData = xml;
            vm.workbench.currentResource.resourceId = vm.workbench.currentResource.resourceId || '';
        });

        projectServices.addProjectBpmnResource(vm.workbench.currentResource).then(function (response) {
            if (response.operationResult === 'OK') {
                reassign(response.list[0].resourceId);
                if (deploy) {
                    projectServices.deployProject(vm.workbench.currentResource.projectId).then(function (response) {
                        if (response.data.operationResult === 'OK') {
                            logger.info('Project has been saved and deployed successfully.');
                        } else {
                            logger.error('Deploy failed.');
                        }
                    });
                } else {
                    logger.info('Project has been saved successfully.');
                }

                if (callback) {
                    callback(taskId);
                }

            } else {
                logger.error('Save failed.');
            }
        });
    }

    function reassign(resourceId) {
        vm.workbench.currentResource.resourceId = resourceId;
        vm.workbench.resources.push(vm.workbench.currentResource);

        vm.workbench.sheets.forEach(function (item, i) {
            if (item.active) {
                vm.workbench.sheets[i] = vm.workbench.currentResource;
                vm.workbench.sheets[i].active = true;
            }
        });
    }

    function preSave() {
        angular.element('#diagramDetail').removeClass('ng-hide');
    }

    function newResource(num) {

        //Create a new resource
        vm.workbench.currentResource = {
            cfgResourceTypes: num === 1 ? {
                    id: 1,
                    description: 'BPMN'
                } : {
                    id: 2,
                    description: 'CMMN'
                },
            resourceDoList: [],
            resourceName: 'Name it!',
            resourceData: num === 1 ? constants.bpmnEmpty : constants.cmmnEmpty,
            projectId: vm.workbench.resources[0].projectId
        };

        switchResource(vm.workbench.currentResource, true);

        //vm.diagramManager.createProcess();
        logger.info('A new Resource has been created');
    }

    function switchResource(res, force) {
        //Check active
        var found = false;
        vm.workbench.sheets.forEach(function (item) {
            if (!item.resourceId) {
                item.active = false;
                return;
            }
            else if (item.resourceId === res.resourceId) {
                item.active = true;
                found = true;
                // the active tab is set as currentResource
                vm.workbench.currentResource = item;
            }
            else {
                item.active = false;
            }
        });

        if (!found) {
            var resource = angular.copy(res);
            resource.active = true;
            vm.workbench.sheets.push(resource);
            // the new resource is set as currentResource
            vm.workbench.currentResource = resource;
        }

        //Open the BPMN
        vm.diagramManager.openProcess(vm.workbench.currentResource, force);
    }

    function openFsProcess() {
        var obj = angular.element('#dgr-uploader');
        obj[0].update = function () {
            var file = this.files[0];
            if (file !== null) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    vm.workbench.currentResource.resourceData = e.target.result;
                    vm.diagramManager.openProcess(vm.workbench.currentResource);
                };
                reader.readAsText(file);
            }
        };

        obj.click();
    }

    function source(val) {
        vm.diagramManager.getBpmnXml(function (err, xml) {
            vm.workbench.currentResource.resourceData = xml;
        });

        togglePropertiesPanelBy(val);
    }

    function newProcess() {
        vm.diagramManager.createProcess();
    }

    function deployProject() {
        saveCurrentProcess(true);
    }

    function toggleFullScreen() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    function toggleZoom(isIn) {
        vm.workbench.eventBus.fireEvent('zoom-changed', isIn);
    }

    function togglePropertiesPanelBy(propToShow) {
        if (vm.workbench.currentPropertyDisplay === propToShow) {
            vm.workbench.currentPropertyDisplay = ''; //hide
        } else {
            vm.workbench.currentPropertyDisplay = propToShow; //show
        }
    }

    function getFormFields(formId, callBack){
        formsServices.getFormFields(formId)
            .then(function(dataresponse){
                callBack(dataresponse, vm.diagramManager);
            });
    }
};

controller.$inject = ['projectServices', 'logger', '$modal', 'formsServices'];

module.exports = function () {
    return {
        scope: {
            diagramManager: '='
        },
        restrict: 'E',
        template: template,
        bindToController: true,
        controller: controller,
        controllerAs: 'vm'
    };
};

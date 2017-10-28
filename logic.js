
$(document).ready(function () {
    storyObj.loadLocalStorage();
    storyObj.setUIcomponents();
});


var colors = {
    colors: ["#ff5c33", "#ffb84d", "#6699ff", "#ffd633", "#ff4dff",
        "#ff3377", "#cc9966", "#00cccc", "#4775d", "#cc99ff", "#ff4d94"],
};

var allData = {
};

var test = 1;

var storyObj = {

    openDialog: function (event) {
        $("#tabs").tabs("disable", 1);
        var formDialog = $("#add_story_window");
        formDialog.dialog({
            autoOpen: false,
            modal: true,
            width: 500,
            buttons: {
                "Create": function () {
                    var froalaElement = $("#story_description").froalaEditor('html.get');
                    var descriptionText = $(froalaElement).text();

                    var valid = $("#story_title_input").val().length > 0 &&
                        descriptionText != "" && $("#datepicker").val().length > 0;
                    if (valid) {
                        var column = $(event.target).siblings("ul");
                        var singleStoryObj = storyObj.collectFormData();
                        storyObj.createStoryRow(singleStoryObj, column);
                        storyObj.saveAllData();
                        $(this).dialog("close");
                    }
                    else {
                        alert('Please fill the fields');
                    }
                },
                Cancel: function () {
                    storyObj.initFormFields();
                    $(this).dialog("close");
                }
            },
            open: function () {
                storyObj.initFormFields();
            }
        });
        formDialog.dialog("open");
    },

    deleteStory: function (event) {
        var deleteDialog = $('<div id="dialog-confirm" title="Empty the recycle bin?">');
        var message = $("<p>").text("Are you sure you want to delete this story ?")
        deleteDialog.append(message);
        deleteDialog.dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Delete": function () {
                    var row = $(event.target).parent().parent();
                    row.remove();
                    storyObj.saveAllData();
                    deleteDialog.dialog("close");
                    deleteDialog.remove();
                },
                Cancel: function () {
                    deleteDialog.dialog("close");
                }
            }
        });
        deleteDialog.dialog("open");
    },

    editStory: function (event) {
        $("#tabs").tabs("enable", 1);
        var formDialog = $("#add_story_window");
        formDialog.dialog({
            autoOpen: false,
            modal: true,
            width: 500,
            buttons: {
                "Update": function () {
                    var froalaElement = $("#story_description").froalaEditor('html.get');
                    var descriptionText = $(froalaElement).text();
                    var valid = $("#story_title_input").val().length > 0 &&
                        descriptionText != "" && $("#datepicker").val().length > 0;
                    if (valid) {
                        var parent = $(event.target).parent().parent();
                        var singleStoryObj = storyObj.collectFormData();
                        storyObj.updateStoryRow(singleStoryObj, parent);
                        storyObj.saveAllData();
                        $(this).dialog("close");
                    }
                    else {
                        alert('Please fill the fields');
                    }
                },
                Cancel: function () {
                    storyObj.initFormFields();
                    $(this).dialog("close");
                }
            },
            open: function () {
                var data = $(event.target).parent().parent().data("story");
                storyObj.setEditFormFields(data);
            }
        });
        formDialog.dialog("open");
        $(".single_comment_row").click(function (event) {
            alert($(this).children("p").text());
        });
    },

    initFormFields: function () {
        $("#story_title_input").val("");
        $("#datepicker").val("");
        $("#slider").slider("value", 1);
        $(".Priority_Output").val($("#slider").slider("value"));
        $("#story_description").froalaEditor('html.set', "");

    },

    collectFormData: function () {
        storyDataObject = {};
        storyDataObject.title = $("#story_title_input").val();
        froalaElement = $("#story_description").froalaEditor('html.get');
        storyDataObject.description = $(froalaElement).text();
        storyDataObject.priority = $(".Priority_Output").val();
        storyDataObject.date = $("#datepicker").val();
        return storyDataObject;
    },

    createStoryRow: function (singleStoryObj, column) {
        var row = $('<li class="ui-state-default single_story_row">');

        var tooltip = $('<a class="tooltip ui-sortable-handle">').attr("title", singleStoryObj.description).data("story", singleStoryObj);
        var titleLabel = $('<label class="story_row_title">').text(singleStoryObj.title);
        var dateLabel = $('<label class="story_row_date">').text(singleStoryObj.date);
        var priorityLabel = $('<label class="story_row_priority">').text("(" + singleStoryObj.priority + ")");
        var editIcon = $(' <i class="fa fa-pencil edit_story_icon" aria-hidden="true">').click(storyObj.editStory);
        var trashIcon = $('<i class="fa fa-trash trash_story_icon" aria-hidden="true">').click(storyObj.deleteStory);
        row.append(titleLabel);
        row.append(dateLabel);
        row.append(priorityLabel);
        row.append(editIcon);
        row.append(trashIcon);
        tooltip.append(row);
        $(column).append(tooltip);
    },


    setEditFormFields: function (dataObj) {
        $("#story_title_input").val(dataObj.title);
        $("#datepicker").val(dataObj.date);
        $("#slider").slider("value", dataObj.priority);
        $(".Priority_Output").val($("#slider").slider("value"));
        $("#story_description").froalaEditor('html.set', dataObj.description);
    },

    updateStoryRow: function (dataObj, element) {
        element.attr("title", dataObj.description).data("story", dataObj);
        element.find("li .story_row_date").text(dataObj.date);
        element.find("li .story_row_title").text(dataObj.title);
        element.find("li .story_row_priority").text("(" + dataObj.priority + ")");
    },

    saveAllData: function () {
        var colorsObject = {};
        var columnsNumber = ($("#wrapper").children().length);
        for (var i = 0; i < columnsNumber; i++) {
            var currentColumn = ($("#wrapper").children()[i]);
            var headerColor = ($(currentColumn).children("h3").css("background-color"));
            var currentColumnName = $(currentColumn).children("h3").text();
            colorsObject[currentColumnName] = headerColor;
            var linksPerColumn = ($(currentColumn).find("a").length);
            var objArray = [];
            for (var j = 0; j < linksPerColumn; j++) {
                var currentLink = $(currentColumn).find("a")[j];
                objArray.push($(currentLink).data("story"))
            }
            allData[currentColumnName] = objArray;
        }
        var localStorageString = JSON.stringify(allData);
        var colorString = JSON.stringify(colorsObject);
        window.localStorage.setItem("allColumns", localStorageString);
        window.localStorage.setItem("allColumnColors", colorString)
    },

    createColumn: function (columnName, color) {
        var column = $("<div>").addClass("column");
        var addStoryLabel = $("<label>").addClass("addStorybtn").text("+").click(storyObj.openDialog);
        var h3 = $("<h3>").text(columnName).css("background-color", color);
        var ul = $("<ul>").addClass("sortable_story_list connectedSortable");
        column.append(addStoryLabel);
        column.append(h3);
        return column;
    },

    createDefaultColumns: function () {
        var names = ["To Do", "In Progress", "Done"];
        for (var i = 0; i < 3; i++) {
            var column = $("<div>").addClass("column");
            var addStoryLabel = $("<label>").addClass("addStorybtn").text("+").click(storyObj.openDialog);
            var h3 = $("<h3>").attr("id", "sortable" + i + "-head").text(names[i]);
            var ul = $("<ul>").addClass("sortable_story_list connectedSortable");
            column.append(addStoryLabel);
            column.append(h3);
            column.append(ul);
            $("#wrapper").append(column);
        }
    },

    loadLocalStorage: function () {
        var localStorageString = window.localStorage.getItem("allColumns");
        if (localStorageString != null) {
            var dataToLoad = JSON.parse(localStorageString);
            var colorArray = JSON.parse(window.localStorage.getItem("allColumnColors"));
            for (key in dataToLoad) {
                var column = storyObj.createColumn(key, colorArray[key]);
                var ul = $("<ul>").addClass("sortable_story_list connectedSortable");
                column.append(ul);
                for (var i = 0; i < dataToLoad[key].length; i++) {
                    storyObj.createStoryRow(dataToLoad[key][i], ul);
                }
                $("#wrapper").append(column);
            }
        } else {
            storyObj.createDefaultColumns();
        }
    },

    setUIcomponents: function () {
        $(".sortable_story_list").sortable({
            connectWith: ".connectedSortable",
            update: function (event, ui) {
                storyObj.saveAllData();
            }
        }).disableSelection();

        $("#tabs").tabs();

        $("#slider").slider({
            value: 1,
            min: 1,
            max: 5,
            step: 1,
            slide: function (event, ui) {
                $(".Priority_Output").val(ui.value);
            }
        });
        $(".Priority_Output").val($("#slider").slider("value"));
        $("#datepicker").datepicker();
        $("#story_description").froalaEditor({
            initOnClick: true,
        });

        $("#story_description").froalaEditor({
        });

        $(document).tooltip();
    }
};


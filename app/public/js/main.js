/*
 * author : abhishek goswami
 * abhishekg785@gmail.com
 *
 * main.js : handles the front-end activity of the app
 */

;(function(d, w, $, $w, $d) {
    'use strict'

    var $Objects = {};
    var $Globals = {};

    var	Functions = {
        /**
         * sends ajax  request to the server with the file path.
         * this function will fetch the data of the file in the
         * path passed as a parameter.
         *
         * @param { string } url - url of the server
         * @param { string } filePath - Path to the file
         */
        FetchFileData : function(url, filePath, action) {
            $.ajax({
                url : url,
                type : 'POST',
                data : {
                    'filePath' : filePath,
                    'action' : action
                },
                success : function(data) {
                    Functions.HideMessage()
                        .HideLoader()
                        .EnableNavButtons();
                    var data = JSON.parse(data);
                    $Globals.dataArr = data; // cache the data for future queries
                    Functions.DisplayFetchedLogs($Globals.dataArr);
                },
                error : function(err) {
                    console.log(err);
                    Functions.HideLoader().LogErrorMessage('<p><span>Error occurred :(</span> Try Again !</p>');
                }
            });

            return Functions;
        },

        /**
         * Hides the message part
         *
         * @return { object } : Functions
         */
        HideMessage : function() {
            $Objects.Message.css('display', 'none');
            return Functions;
        },

        /**
         * Displays the message part
         *
         * @return { object } : Functions
         */
        ShowMessage : function() {
            $Objects.Message.css('display', 'block');
            return Functions;
        },

        /**
         * Displays the Loader
         *
         * @return { object } : Functions
         */
        ShowLoader : function() {
            $Objects.LoaderContainer.css('display', 'block');
            return Functions;
        },

        /**
         * Hides the Loader
         *
         * @return { object } : Functions
         */
        HideLoader : function() {
            $Objects.LoaderContainer.css('display', 'none');
            return Functions;
        },

        /**
         * Activates the Nav Button Section
         *
         * @return { object } : Functions
         */
        EnableNavButtons : function() {
            $Objects.NavigationButton.prop("disabled", false);
            return Functions;
        },

        /**
         * De-Activates the Nav Button Section
         *
         * @return { object } : Functions
         */
        DisableNavButtons : function() {
            $Objects.NavigationButton.prop("disabled", true);
            return Functions;
        },

        /**
         * Displays the message passed as a parameter
         *
         * @param { string } message - Message to display
         * @return { object } : Functions
         */
        LogErrorMessage : function(message) {
            $Objects.DataViewMessage.html(message);
            return Functions;
        },

        /**
         * Displays the fetched logs into the DOM
         *
         * @param { array } dataArr - Array of the 10 fetched logs
         * @return { object } : Functions
         */
        DisplayFetchedLogs : function(dataArr) {
            $Objects.DataView.empty();
            var html = "<ul>";
            dataArr.forEach(function(data) {
                html += "<li>" + data + "</li>";
            });
            html += "</ul>";
            $Objects.DataView.append(html);
            return Functions;
        }
    }

    // flow of the code starts here
    $d.ready(function() {
        $Objects.PathString = $('#path-string');
        $Objects.ViewButton = $('#view-button');
        $Objects.Message = $('.message');
        $Objects.DataViewMessage = $('#data-view .message');
        $Objects.LoaderContainer = $('#loader-container');
        $Objects.NavigationButton = $('.nav-button');
        $Objects.DataView = $('#data-view');

        var requestURL = 'http://localhost:3000';

        // fired when view Button is clicked
        $Objects.ViewButton.bind('click', function(e) {
            var filePath = $Objects.PathString.val();
            if(filePath == "") {
                $Objects.DataViewMessage.html("<p><span>File Path</span> is Required !</p>");
                return false;
            }
            var action = 'initial';
            Functions.FetchFileData(requestURL, filePath, action).ShowLoader();
        });

        // fired when buttons on the navigation section are clicked
        $Objects.NavigationButton.bind('click', function(e) {
            var filePath = $Objects.PathString.val();
            var action = e.target.dataset.type;
            Functions.FetchFileData(requestURL, filePath, action).ShowLoader();
        });

        // disables the nav buttons
        Functions.DisableNavButtons();
    });

    // for testing puposes
    w.$Objects = $Objects;
    w.Functions = Functions;
    w.$Globals = $Globals;

})(document, window, jQuery, jQuery(window), jQuery(document));

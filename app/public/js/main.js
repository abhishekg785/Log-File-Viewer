/*
* author : abhishek goswami
* abhishekg785@gmail.com
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
						Functions.HideLoader().LogErrorMessage();
					}
				});

				return Functions;
			},

			HideMessage : function() {
				$Objects.Message.css('display', 'none');
				return Functions;
			},

			ShowMessage : function() {
				$Objects.Message.css('display', 'block');
				return Functions;
			},

			ShowLoader : function() {
				$Objects.LoaderContainer.css('display', 'block');
				return Functions;
			},

			HideLoader : function() {
				$Objects.LoaderContainer.css('display', 'none');
				return Functions;
			},

			EnableNavButtons : function() {
				$Objects.NavigationButton.prop("disabled", false);
				return Functions;
			},

			DisableNavButtons : function() {
				$Objects.NavigationButton.prop("disabled", true);
				return Functions;
			},

			LogErrorMessage : function() {
				$Objects.DataViewMessage.html("<p><span>Error Occurred :(</span> Try Again after some time !</p>");
				return Functions;
			},

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

	$d.ready(function() {
		$Objects.PathString = $('#path-string');
		$Objects.ViewButton = $('#view-button');
		$Objects.Message = $('.message');
		$Objects.DataViewMessage = $('#data-view .message');
		$Objects.LoaderContainer = $('#loader-container');
		$Objects.NavigationButton = $('.nav-button');
		$Objects.DataView = $('#data-view');

		var requestURL = 'http://localhost:3000';

		$Objects.ViewButton.bind('click', function(e) {
			var filePath = $Objects.PathString.val();
			if(filePath == "") {
				$Objects.DataViewMessage.html("<p><span>File Path</span> is Required !</p>");
				return false;
			}
			var action = 'initial';
			Functions.FetchFileData(requestURL, filePath, action).ShowLoader();
		});

		$Objects.NavigationButton.bind('click', function(e) {
			var filePath = $Objects.PathString.val();
			var action = e.target.dataset.type;
			Functions.FetchFileData(requestURL, filePath, action).ShowLoader();
		});

		Functions.DisableNavButtons();
	});

})(document, window, jQuery, jQuery(window), jQuery(document));

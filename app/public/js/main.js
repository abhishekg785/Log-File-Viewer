/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

;(function(d, w, $, $w, $d) {
	'use strict'

	var $Objects = {};
	var $Globals = {};

	var	Functions = {
			/*
			* sends an ajax  request to the server with the file path.
			* this function will fetch the data of the file in the
			* path passed as a parameter.
			*
			* @param { string } filepath = Path to the file to fetch data from
			*/
			FetchFileData : function(filePath, action) {
				$.ajax({
					url : 'http://localhost:3000',
					type : 'POST',
					data : {
						'filePath' : filePath,
						'action' : action
					},
					success : function(data) {
						Functions.HideMessage().HideLoader().EnableNavButtons();
						console.log(data);
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
			},

			ShowLoader : function() {
				$Objects.LoaderContainer.css('display', 'block');
			},

			HideLoader : function() {
				$Objects.LoaderContainer.css('display', 'none');
				return Functions;
			},

			EnableNavButtons : function() {
				$Objects.NavigationButton.prop("disabled", false);
			},

			DisableNavButtons : function() {
				$Objects.NavigationButton.prop("disabled", true);
			},

			LogErrorMessage : function() {
				$('#data-view .message').html("<p><span>Error Occurred :(</span> Try Again after some time !</p>");
			}
		}


	$d.ready(function() {

		$Objects.PathString = $('#path-string');
		$Objects.ViewButton = $('#view-button');
		$Objects.Message = $('.message');
		$Objects.LoaderContainer = $('#loader-container');
		$Objects.NavigationButton = $('.nav-button');

		$Objects.ViewButton.bind('click', function(e) {
			var filePath = $Objects.PathString.val();
			var action = 'initial';
			Functions.FetchFileData(filePath, action).ShowLoader();
		});

		$Objects.NavigationButton.bind('click', function(e) {
			var filePath = $Objects.PathString.val();
			var action = e.target.dataset.type;
			Functions.FetchFileData(filePath, action).ShowLoader();
		});

		Functions.DisableNavButtons();
	});

})(document, window, jQuery, jQuery(window), jQuery(document));

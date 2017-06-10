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
						console.log(data);
					},
					error : function(err) {
						console.log(err);
					}
				});
			}
		}

	$d.ready(function() {
		$Objects.PathString = $('#path-string');
		$Objects.ViewButton = $('#view-button');

		$Objects.ViewButton.bind('click', function(e) {
			var filePath = $Objects.PathString.val();
			var action = 'initial';
			Functions.FetchFileData(filePath, action);
		});

		$Objects.NavigationButton = $('.nav-button');

		$Objects.NavigationButton.bind('click', function(e) {
			var filePath = $Objects.PathString.val();
			var action = e.target.dataset.type;
			Functions.FetchFileData(filePath, action);
		});

	});

})(document, window, jQuery, jQuery(window), jQuery(document));

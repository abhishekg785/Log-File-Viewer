/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

;(function(d, w, $, $w, $d) {
	'use strict'
	var $Objects = {},
		Functions = {

			/*
			* sends an ajax  request to the server with the file path.
			* this function will fetch the data of the file in the 
			* path passed as a parameter.
			* 
			* @param { string } filepath = Path to the file to fetch data from
			*/
			FetchFileData : function(filePath) {
				$.ajax({
					url : 'http://localhost:3000/',
					type : 'POST',
					data : {
						'filePath' : filePath
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
		$Objects.ViewButton = $('#view-button')
			.bind('click', function(e) {
				var filePath = $Objects.PathString.val();
				Functions.FetchFileData(filePath);
			});
	});

})(document, window, jQuery, jQuery(window), jQuery(document));
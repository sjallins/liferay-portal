Liferay.Dock = {
	init: function() {
		var instance = this;

		var dock = jQuery('.lfr-dock');

		if (!dock.is('.interactive-mode')) {
			return;
		}

		dock.addClass('lfr-component');

		var dockList = dock.find('.lfr-dock-list');

		if (dockList.length > 0){
			var myPlaces = jQuery('.my-places', dock);

			Liferay.Util.createFlyouts(
				{
					container: dockList[0],
					mouseOver: function(event) {
						if (this.className.indexOf('my-places') > -1) {
							jQuery('.current-community > ul', this).show();
						}
						else if (this.parentNode.className.indexOf('taglib-my-places') > -1) {
							jQuery('ul', this.parentNode).hide();
							jQuery('> ul', this).show();
						}
					}
				}
			);

			dockList.find('li:first-child, a:first-child').addClass('first');
			dockList.find('li:last-child, a:last-child').addClass('last');

			instance._dock = dock;
			instance._dockList = dockList;
			instance._myPlaces = myPlaces;

			dockList.hide();
			dockList.wrap('<div class="lfr-dock-list-container"></div>');

			dock.css(
				{
					cursor: 'pointer',
					position: 'absolute',
					zIndex: Liferay.zIndex.DOCK
				}
			);

			var dockOver = function(event) {
				instance._setCloser();
				instance._toggle('show');
			};

			var dockOut = function(event) {
				instance._toggle('hide');
			};

			dock.hoverIntent(
				{
					interval: 0,
					out: dockOut,
					over: dockOver,
					timeout: 500
				}
			);

			if (Liferay.Browser.is_ie && Liferay.Browser.version() <= 6) {
				myPlaces.find('> ul').css('zoom', 1);
			}

			var dockParent = dock.parent();

			dockParent.css(
				{
					position: 'relative',
					zIndex: Liferay.zIndex.DOCK_PARENT
				}
			);

			instance._handleDebug();
		}
	},

	_handleDebug: function() {
		var instance = this;

		var dock = instance._dock;
		var dockList = instance._dockList;
		var myPlacesList = instance._myPlaces.find('> ul');

		if (dock.is('.debug')) {
			dock.show();
			dockList.show();
			dockList.addClass('expanded');
		}
	},
	
	_setCloser: function() {
		var instance = this;

		if (!instance._hovered) {
			jQuery(document).one(
				'click',
				function(event) {
					var currentEl = jQuery(event.target);
					var dockParent = currentEl.parents('.lfr-dock');
					if ((dockParent.length == 0) && !currentEl.is('.lfr-dock')) {
						instance._toggle('hide');
						instance._hovered = false;
					}
				}
			);

			instance._hovered = true;
		}
	},

	_toggle: function(state) {
		var instance = this;

		var dock = instance._dock;
		var dockList = instance._dockList;

		if (state == 'hide') {
			dockList.hide();
			dock.removeClass('expanded');
		}
		else if (state == 'show') {
			dockList.show();
			dock.addClass('expanded');
		}
		else {
			dockList.toggle();
			dock.toggleClass('expanded');
		}
	},
	
	_hovered: false
};
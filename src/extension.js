import St from 'gi://St';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as DateMenu from 'resource:///org/gnome/shell/ui/dateMenu.js';

export default class extends Extension {
  enable() {
    this._panelMenuButton = new PanelMenu.Button(0, this.metadata.name, false);

    this._panelMenuButton.add_child(
      new St.Icon({
        icon_name: 'applets-screenshooter-symbolic',
        style_class: 'system-status-icon',
      })
    );

    const centerBox = Main.panel._centerBox;
    const children = centerBox.get_children();

    const clockIndex = children.findIndex(
      c => c.child instanceof DateMenu.DateMenuButton ||
           c instanceof DateMenu.DateMenuButton
    );

    if (clockIndex !== -1) {
      Main.panel.addToStatusArea(this.uuid, this._panelMenuButton, clockIndex + 1, 'center');
    } else {
      Main.panel.addToStatusArea(this.uuid, this._panelMenuButton, 0, 'center');
    }

    // Quick fix to GNOME 49+
    this._panelMenuButton.clear_actions();

    this._panelMenuButton.connect('button-press-event', function () {
      Main.screenshotUI.open();
    });
  }

  disable() {
    this._panelMenuButton?.destroy();
    this._panelMenuButton = null;
  }
}

import * as THREE from 'three';

class SyncTargetControls {
    constructor(params) {
        const { cameras, controls } = params;
        this.cameras = cameras;
        this.controls = controls;
        this.enabled = true;
        this.isSyncing = false;
        this.offsets = cameras.map(() => new THREE.Vector3());
        this._init();
    }

    _init() {
        this.updateAllOffsets();
        this.controls.forEach((control, index) => {
            control.addEventListener('change', () => {
                if (!this.enabled || this.isSyncing) return;
                this.isSyncing = true;
                this._syncFrom(index);
                this.isSyncing = false;
            });
        });
    }

    updateAllOffsets() {
        this.controls.forEach((control, i) => {
            this.offsets[i].copy(this.cameras[i].position).sub(control.target);
        });
    }

    enable(state) {
        this.enabled = state;
        if (state) {
            this.updateAllOffsets();
        }
    }

    _syncFrom(sourceIndex) {
        const sourceControl = this.controls[sourceIndex];
        const newTarget = sourceControl.target;
        this.offsets[sourceIndex].copy(this.cameras[sourceIndex].position).sub(newTarget);
        for (let i = 0; i < this.controls.length; i++) {
            if (i === sourceIndex) continue;
            const targetControl = this.controls[i];
            const camera = this.cameras[i];
            camera.position.copy(newTarget).add(this.offsets[i]);
            targetControl.target.copy(newTarget);
            targetControl.update();
        }
    }
}

export default SyncTargetControls;
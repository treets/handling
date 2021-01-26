namespace handling {
    /**
     * A simple pick and place movement.
     * @param kin the kinematic object to be used
     * @param pos the position to be reached
     * @param vel the max velocity
     * @param acc acceleration and deceleration
     * @param start the minimum height to be reached before blending for the first movement
     * @param end the minimum height to be reached after blending for the third movement
     * @param max the total maximum height of movement
     */
    //% block="jump %kin to positions %pos at %vel with %acc acceleration blending from %startHeight to %endHeight limited by %maxHeight"
    //% kin.fieldEditor="configInstance"
    //% kin.fieldOptions.property="kins"
    //% inlineInputMode=inline
    export function moveJumpAbsolute(kin: motion.Kinematic, pos: number[], vel: number, acc: number, startHeight: number, endHeight: number, maxHeight: number) {
        const current = kin.values;
        const first = [current[0], current[1], maxHeight];
        const second = [pos[0], pos[1], maxHeight];
		
        for (let i = pos.length; i < 16; i++) {
            pos.push(0);
            first.push(0);
            second.push(0);
        }
		
        MotionLib.kinCmdBlendP(kin.name, maxHeight - current(2) - startHeight, (Math.sqrt(Math.pow((pos(0)-current(0)),2) + Math.pow((pos(1)-current(1)),2))/2) );		
        MotionLib.kinCmdMoveLinAbs(kin.name, first, 'PCS', vel, acc, acc, 0, 0);		
        MotionLib.kinCmdBlend( ((Math.sqrt(Math.pow((pos(0)-current(0)),2) + Math.pow((pos(1)-current(1)),2))/2) , kin.name, maxHeight - pos(2) - endHeight);		
        MotionLib.kinCmdMoveLinAbs(kin.name, second, 'PCS', vel, acc, acc, 0, 0);		
        MotionLib.kinCmdMoveLinAbs(kin.name, pos, 'PCS', vel, acc, acc, 0, 0);
		
        // const xDir: AxisDir = current[0] - pos[0] > 0 ? AxisDir.NEGATIVE : AxisDir.POSITIVE;
        // control.pauseUntilAxisPositionPassed(kin.getAxis(AxisMeaning.MAIN_AXIS_X), pos[0], xDir, 0);
        // control.pauseUntilAxisPositionPassed(kin.getAxis(AxisMeaning.MAIN_AXIS_Z), pos[2], AxisDir.NEGATIVE, 0);
        while (kin.moving()) {
            loops.pause(0.001);
        }
    }
}

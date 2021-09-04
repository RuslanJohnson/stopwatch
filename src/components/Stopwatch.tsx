import { FC, useState, useRef, useCallback, useMemo } from "react";
import "styles/stopwatch.css";

const UPDATE_INTERVAL = 10;

const formatTime = (value: number) => {
	const hours = Math.floor((value / (100 * 60 * 60)) % 60);
	const minutes = Math.floor((value / (100 * 60)) % 60);
	const seconds = Math.floor((value / 100) % 60);
	const milliseconds = value % 100;

	const values = [hours, minutes, seconds, milliseconds];

	const formatedTime = values.map((unit) => `0${unit}`.slice(-2)).join(":");

	return formatedTime;
};

const Stopwatch: FC = () => {
	const timeRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const [time, setTime] = useState(0);
	const [laps, setLaps] = useState<number[]>([]);
	const [isActive, setIsActive] = useState(false);

	const start = useCallback(() => {
		timeRef.current = setInterval(() => {
			setTime((prev) => prev + 1);
		}, UPDATE_INTERVAL);

		setIsActive(true);
	}, []);

	const pause = useCallback(() => {
		if (timeRef.current) {
			clearInterval(timeRef.current);
			timeRef.current = null;

			setIsActive(false);
		}
	}, []);

	const reset = useCallback(() => {
		if (timeRef.current) {
			clearInterval(timeRef.current);
			timeRef.current = null;

			setIsActive(false);
		}

		setTime(0);
		setLaps([]);
	}, []);

	const saveLap = useCallback(() => {
		const lap = time;
		setLaps((prev) => [...prev, lap]);
	}, [time]);

	const playButtonText = useMemo(() => {
		if (isActive) return "Pause";
		if (time) return "Continue";

		return "Start";
	}, [time, isActive]);

	return (
		<div className="stopwatch">
			<h3 className="time">{formatTime(time)}</h3>
			<div className="btns">
				<button className="btn-start" onClick={isActive ? pause : start}>
					{playButtonText}
				</button>
				<button
					className="btn-reset"
					disabled={!isActive && !time}
					onClick={reset}
				>
					Reset
				</button>
				<button className="btn-lap" disabled={!isActive} onClick={saveLap}>
					Lap
				</button>
				<ul className="laps">
					{laps.map((time) => (
						<li key={time} className="lap">
							{formatTime(time)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Stopwatch;

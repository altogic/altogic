import React from 'react';
import './App.css';
import altogic from './altogic';
import colors from './colors';
import Core from './core';

class App extends React.PureComponent {
	constructor(props) {
		super(props);

		this.msgSender = new Core.Interval(this.sendMessage, 50);

		this.state = {
			joined: false,
			username: '',
			members: [],
			channelInfo: '',
			infoColor: '',
			x: -1,
			y: -1,
			color: colors[Math.floor(Math.random() * colors.length)],
			canSendMessage: false,
		};
	}

	componentDidMount() {
		altogic.realtime.onConnect(() => console.log('connected'));
		altogic.realtime.onDisconnect((reason) => {
			console.log('disconnected', reason, altogic.realtime.getSocketId());
		});
		altogic.realtime.onReconnectAttempt((attemptNumber) =>
			console.log('reconnecting', attemptNumber)
		);
		altogic.realtime.onError((error) =>
			console.log('error', error, error.data)
		);

		//Register event listeners
		altogic.realtime.onJoin(this.joinMember);
		altogic.realtime.onLeave(this.leaveMember);
		altogic.realtime.onUpdate(this.updateMember);

		//Track the mouse movements of channel members
		altogic.realtime.on('track', this.trackMember);
	}

	joinMember = (payload) => {
		const { members } = this.state;
		console.log('member joining', payload);
		this.setState({
			members: [
				...members,
				{
					id: payload.message.id,
					username: payload.message.data.username,
					color: payload.message.data.color,
					x: -1,
					y: -1,
				},
			],
			channelInfo: `${payload.message.data.username} joined channel`,
			infoColor: payload.message.data.color,
		});
	};

	leaveMember = (payload) => {
		const { members } = this.state;
		console.log('member leaving', payload);
		this.setState({
			members: members.filter((entry) => entry.id !== payload.message.id),
			channelInfo: `${payload.message.data.username} left channel`,
			infoColor: payload.message.data.color,
		});
	};

	updateMember = (payload) => {
		const { members } = this.state;
		let updatedMembers = null;
		//If it is a member not included in the current list add it
		let exists = members.find((entry) => entry.id === payload.message.id);
		if (!exists) {
			console.log('adding member', payload);
			updatedMembers = [
				...members,
				{
					id: payload.message.id,
					username: payload.message.data.username,
					color: payload.message.data.color,
					x: -1,
					y: -1,
				},
			];
		} else {
			console.log('updating member', payload);
			updatedMembers = members.map((entry) => {
				if (entry.id !== payload.message.id) return entry;
				else
					return {
						...entry,
						username: payload.message.data.username,
						color: payload.message.data.color,
					};
			});
		}

		this.setState({ members: updatedMembers });
	};

	trackMember = (payload) => {
		const { members } = this.state;
		let updatedMembers = null;

		console.log('tracking member', payload);
		//If it is a member not included in the current list add it
		let exists = members.find((entry) => entry.id === payload.message.id);
		if (!exists)
			updatedMembers = [
				...members,
				{
					id: payload.message.id,
					username: payload.message.username,
					color: payload.message.color,
					x: payload.message.x,
					y: payload.message.y,
				},
			];
		else
			updatedMembers = members.map((entry) => {
				if (entry.id !== payload.message.id) return entry;
				else return payload.message;
			});

		this.setState({ members: updatedMembers });
	};

	moveMouse = (event) => {
		const { x, y } = this.state;
		if (
			event.target.offsetLeft !== undefined &&
			event.target.offsetTop !== undefined
		) {
			let newX = event.clientX - event.target.offsetLeft;
			let newY = event.clientY - event.target.offsetTop;
			if (x !== newX || y !== newY) {
				this.setState({
					x: event.clientX - event.target.offsetLeft,
					y: event.clientY - event.target.offsetTop,
					canSendMessage: true,
				});
			} else {
				this.setState({ canSendMessage: false });
			}
		} else this.setState({ canSendMessage: false });
	};

	sendMessage = () => {
		const { x, y, username, color, joined, canSendMessage } = this.state;

		if (joined && canSendMessage) {
			altogic.realtime.send('presence', 'track', {
				username: username,
				color: color,
				x: x,
				y: y,
				id: altogic.realtime.getSocketId(),
			});
		}
	};

	render() {
		return (
			<div className="App">
				{this.renderChannel()}
				{this.renderPresence()}
			</div>
		);
	}

	renderChannel() {
		const { joined, username, color, infoColor, channelInfo } = this.state;

		if (joined) {
			return (
				<div className="channel">
					<div className="marginTop">
						<input
							type="button"
							value="Leave"
							className="button"
							disabled={!username || username.length <= 2}
							onClick={() => {
								altogic.realtime.leave('presence');
								this.setState({
									joined: false,
									members: [],
									channelInfo: '',
									infoColor: '',
								});
							}}
							style={{ marginLeft: '10px' }}
						/>
						&nbsp;
						<input
							type="button"
							value="Update member data"
							className="button"
							onClick={() => {
								let newColor =
									colors[Math.floor(Math.random() * colors.length)];

								// You can assign any custom data to a user profile, in this case we assign username, color and id
								altogic.realtime.updateProfile({
									username: username,
									color: newColor,
									id: altogic.realtime.getSocketId(),
								});

								this.setState({ color: newColor });
							}}
						/>
						<div className="membersArea marginTop">{this.renderMembers()}</div>
						{channelInfo && (
							<div
								className="membersArea marginTop"
								style={{ color: infoColor }}
							>
								{channelInfo}
							</div>
						)}
					</div>
				</div>
			);
		} else {
			return (
				<div className="channel">
					<div className="inputArea marginTop">
						<input
							type="text"
							value={username}
							onChange={(event) => {
								this.setState({ username: event.target.value.trim() });
							}}
							style={{ marginRight: '10px' }}
							placeholder="Username"
						/>
						<input
							type="button"
							value="Join"
							className="button"
							disabled={!username || username.length <= 2}
							onClick={async () => {
								altogic.realtime.updateProfile({
									username: username,
									color: color,
									id: altogic.realtime.getSocketId(),
								});
								//Join to the presence channel
								altogic.realtime.join('presence');
								//Get the list of members in presence channel
								let members = await altogic.realtime.getMembers('presence');
								this.setState({
									joined: true,
									channelInfo: '',
									infoColor: '',
									members: members.map((entry) => {
										return {
											id: entry.id,
											username: entry.data.username,
											color: entry.data.color,
											x: -1,
											y: -1,
										};
									}),
								});
							}}
						/>
					</div>
				</div>
			);
		}
	}

	renderMembers() {
		const { members } = this.state;

		return (
			<div className="membersHolder">
				{members.map((entry) => {
					return (
						<div
							className="member"
							style={{
								backgroundColor: `${entry.color}`,
								color: `${this.getContrastYIQ(entry.color)}`,
							}}
						>
							{entry.username.substring(0, 2).toUpperCase()}
						</div>
					);
				})}
			</div>
		);
	}

	getContrastYIQ(hexcolor) {
		hexcolor = hexcolor.replace('#', '');
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);
		var yiq = (r * 299 + g * 587 + b * 114) / 1000;
		return yiq >= 128 ? 'black' : 'white';
	}

	renderPresence() {
		const { members, joined } = this.state;
		return (
			<div
				className="presence"
				onMouseMove={this.moveMouse}
				onMouseEnter={() => {
					this.msgSender.start();
				}}
				onMouseLeave={() => {
					this.msgSender.stop();
				}}
				style={{ cursor: joined ? 'none' : 'default' }}
			>
				{members.map((member) => {
					if (member.x === -1 && member.y === -1) return null;

					return (
						<React.Fragment key={member.id}>
							<svg
								viewBox="0 0 16.3 24.7"
								className="cursor"
								style={{
									position: 'absolute',
									left: member.x,
									top: member.y,
								}}
							>
								<path
									stroke="#000"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeMiterlimit="10"
									fill={member.color}
									d="M15.6 15.6L.6.6v20.5l4.6-4.5 3.2 7.5 3.4-1.3-3-7.2z"
								/>
							</svg>
							<div
								style={{
									position: 'absolute',
									left: member.x + 25,
									top: member.y + 40,
								}}
							>
								<strong>{member.username}</strong>
							</div>
						</React.Fragment>
					);
				})}
			</div>
		);
	}
}

export default App;

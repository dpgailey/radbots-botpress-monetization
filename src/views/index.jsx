import React from 'react';
import {
	Form,
	FormGroup,
	FormControl,
	Col,
	Button,
	ControlLabel,
	Alert,
	Row,
	Panel,
	Glyphicon,
	Thumbnail
} from 'react-bootstrap';

import style from './style.scss';

export default class MonetizeModule extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			message: null,
			error: null,
			initialStateHash: null
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
		this.handleDismissError = this.handleDismissError.bind(this);
	}

	getAxios() {
		return this.props.bp.axios
	}

	componentDidMount() {
		this.getAxios().get('/api/botpress-monetize/config')
			.then((res) => {
				this.setState({
					loading: false,
					...res.data
				});

				setImmediate(() => {
					this.setState({initialStateHash: this.getStateHash()})
				});

				this.getMetricsData();
			});
	}

	getMetricsData() {
		let agentKey = this.state.agentKey || null;
		let accountKey = this.state.accountKey || null;

		if(agentKey && accountKey) {
			this.getAxios().get(`https://radbots.com/api/agents/${agentKey}/revenue?account_key=${accountKey}`)
				.then((res) => {
					this.setState({
						...res.data, // revenue obj will be set
						error: null
					});
				}, (error) => {
					this.setState({
						error: "Invalid Agent Key or Account Key",
						revenue: null
					});
				});
		}
	}

	getStateHash() {
		const hashingStateItems = [
			'agentKey',
			'accountKey'
		];

		return hashingStateItems.map((i) => {
			return this.state[i]
		}).join(' ')
	}

	handleSaveChanges() {
		this.setState({loading: true});

		return this.getAxios().post('/api/botpress-monetize/config', _.omit(this.state, 'loading', 'initialStateHash', 'message', 'error', 'revenue'))
			.then(() => {
				this.setState({
					message: {
						type: 'success',
						text: 'Your configuration have been saved correctly.'
					},
					loading: false,
					initialStateHash: this.getStateHash()
				});

				this.getMetricsData();
			})
			.catch((err) => {
				this.setState({
					message: {
						type: 'danger',
						text: 'An error occurred during you were trying to save configuration: ' + err.response.data.message
					},
					loading: false,
					initialStateHash: this.getStateHash()
				})
			})
	}

	handleChange(event) {
		let {name, value} = event.target;
		this.setState({
			[name]: value
		})
	}

	handleDismissError() {
		this.setState({error: null})
	}

	renderLabel(label, link) {
		return (
			<Col componentClass={ControlLabel} sm={3}>
				{label}
				<small>(<a target="_blank" href={link}>?</a>)</small>
			</Col>
		)
	}

	renderTextInput(label, name, link, props = {}) {
		return (
			<FormGroup>
				{this.renderLabel(label, link)}
				<Col sm={7}>
					<FormControl name={name} {...props} type="text"
											 value={this.state[name]} onChange={this.handleChange}/>
				</Col>
			</FormGroup>
		)
	}

	renderSaveButton() {
		return (
			<FormGroup>
				<Col smOffset={3} sm={7}>
					<Button className={`btn ${style.radbotsButton}`} onClick={this.handleSaveChanges}>
						<Glyphicon glyph="ok"/> Save
					</Button>
				</Col>
			</FormGroup>
		)
	}

	renderForm() {
		const title = (
			<h3 className={style.radbotsHeader}>Configure RadBots</h3>
		);

		return (
			<Panel header={title}>
				<Row>
					<Col xs={12}>
						<Form horizontal>
							{this.renderTextInput('Agent Key*', 'agentKey', 'https://radbots.com/documentation/developers')}
							{this.renderTextInput('Account Key*', 'accountKey', 'https://radbots.com/documentation/marketplace')}
							{this.renderSaveButton()}
						</Form>
					</Col>
				</Row>
			</Panel>
		)
	}

	renderIncome() {
		const title = (
			<h3 className={style.radbotsHeader}>CTR Income Metrics</h3>
		);
		return (this.state.agentKey && this.state.accountKey && this.state.revenue) ? <Panel header={title}>
				<Row>
					<Col xs={12} sm={3} md={3} className={style.borderRight}>
						<div className={style.getMetricSegmentContainer}>
							<div>Today</div>
							<div className={style.radbotsIncomeValue}>{this.state.revenue.day}</div>
						</div>
					</Col>
					<Col xs={12} sm={3} md={3} className={style.borderRight}>
						<div className={style.getMetricSegmentContainer}>
							<div>This Week</div>
							<div className={style.radbotsIncomeValue}>{this.state.revenue.week}</div>
						</div>
					</Col>
					<Col xs={12} sm={3} md={3} className={style.borderRight}>
						<div className={style.getMetricSegmentContainer}>
							<div>This Month</div>
							<div className={style.radbotsIncomeValue}>{this.state.revenue.month}</div>
						</div>
					</Col>
					<Col xs={12} sm={3} md={3}>
						<div className={style.getPaidBtnContainer}>
							<a className={`btn btn-block ${style.radbotsButton} btn-lg`} href="https://radbots.com" target="_blank">Get Paid <Glyphicon glyph="menu-right"/></a>
						</div>
					</Col>
				</Row>
			</Panel> : undefined;
	}

	renderUnsavedAlert() {
		return (this.state.initialStateHash && this.state.initialStateHash !== this.getStateHash())
			? <Alert bsStyle='warning'>Be careful, you have unsaved changes in your configuration...</Alert>
			: null
	}

	renderMessageAlert() {
		return this.state.message
			? <Alert bsStyle={this.state.message.type}>{this.state.message.text}</Alert>
			: null
	}

	renderHelp() {
		return (
			<Panel>
				<Row>
					<Col xs={12} sm={12} md={5} mdPush={7} lg={4} lgPush={8}>
						<img className={style.radbotsLogo} src="https://i.imgur.com/5Uhq5OU.png" alt="RadBots Logo" width="100%"/>
					</Col>
					<Col xs={12} sm={12} md={7} mdPull={5} lg={8} lgPull={4}>
						<h2>RadBots is the first bot monetization platform</h2>
						<p>To begin serving context and intent aware ads and recommendations, <a className="btn btn-default btn-xs" href="https://radbots.com/users/sign_up" target="_blank">create an account</a> or <a className="btn btn-default btn-xs" href="https://radbots.com/users/sign_in" target="_blank">login</a> at <a href="https://radbots.com" className={style.rawHref}>radbots.com</a>. Then create an `Agent`. Last, copy and paste the `Agent Key` and `Account Key` from the `settings` page below. That's it!</p>
						<div className="btn-toolbar">
							<a className={`btn ${style.radbotsButton}`} href="https://radbots.com/users/sign_in" target="_blank"><Glyphicon glyph="user"/> Sign In</a>
							<a className={`btn btn-default`} href="https://radbots.com/documentation/developers" target="_blank"><Glyphicon glyph="align-left"/> Documentation</a>
						</div>
					</Col>
				</Row>
			</Panel>
		);
	}

	renderErrorAlert() {
		return (
			<Alert bsStyle="danger" onDismiss={this.handleDismissError}>
				<h4>An error occurred during communication with RadBots</h4>
				<p>Details: {this.state.error}</p>
			</Alert>
		)
	}

	renderAllContent() {
		return <div>
			{this.state.error ? this.renderErrorAlert() : null}
			{this.renderUnsavedAlert()}
			{this.renderMessageAlert()}
			{this.renderHelp()}
			{this.renderForm()}
			{this.renderIncome()}
		</div>
	}

	render() {
		return this.state.loading ? null : this.renderAllContent()
	}
}
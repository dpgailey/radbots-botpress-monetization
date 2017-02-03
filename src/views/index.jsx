import React from 'react'
import {
		Form,
		FormGroup,
		FormControl,
		Col,
		Button,
		ControlLabel,
		Alert
} from 'react-bootstrap'

import style from './style.scss'

export default class RadbotsModule extends React.Component {

		constructor(props) {
				super(props);

				this.state = {
						loading:true,
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
				this.getAxios().get('/api/botpress-radbots/config')
						.then((res) => {
								this.setState({
										loading: false,
										...res.data
								});

								setImmediate(() => {
										this.setState({ initialStateHash: this.getStateHash() })
								})
						});
		}

		getStateHash() {
				const hashingStateItems = [
						'agentKey',
						'mediaType',
						'context',
						'personaId',
						'tags',
						'intent'
				];

				return hashingStateItems.map((i) => {
						return this.state[i]
				}).join(' ')
		}

		handleSaveChanges() {
				this.setState({ loading:true });

				return this.getAxios().post('/api/botpress-radbots/config', _.omit(this.state, 'loading', 'initialStateHash', 'message', 'error'))
						.then(() => {
								this.setState({
										message: {
												type: 'success',
												text: 'Your configuration have been saved correctly.'
										},
										loading: false,
										initialStateHash: this.getStateHash()
								})
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
				let { name, value } = event.target;
				this.setState({
						[name]: value
				})
		}

		handleDismissError() {
				this.setState({ error: null })
		}

		renderLabel(label, link) {
				return (
						<Col componentClass={ControlLabel} sm={3}>
								{label} <small>(<a target="_blank" href={link}>?</a>)</small>
						</Col>
				)
		}

		renderTextInput(label, name, link, props = {}) {
				return (
						<FormGroup>
								{this.renderLabel(label, link)}
								<Col sm={7}>
										<FormControl name={name} {...props} type="text"
																 value={this.state[name]} onChange={this.handleChange} />
								</Col>
						</FormGroup>
				)
		}

		renderHeaderSaveButton() {
				return (
						<Button className={style.messengerButton} onClick={this.handleSaveChanges}>
								Save
						</Button>
				)
		}

		renderSaveButton() {
				return (
						<FormGroup>
								<Col smOffset={3} sm={7}>
										<Button className={style.messengerButton} onClick={this.handleSaveChanges}>
												Save
										</Button>
								</Col>
						</FormGroup>
				)
		}

		renderHeader(title) {
				return <div className={style.header}>
						<h4>{title}</h4>
						{this.renderHeaderSaveButton()}
				</div>
		}

		renderForm() {
				return (
						<Form horizontal>
								<div className={style.section}>
										{this.renderHeader('Configure Radbots')}
										<div>
												{this.renderTextInput('Agent Key*', 'agentKey', 'https://radbots.com/documentation/developers')}
												{this.renderTextInput('Media Types', 'mediaType', 'https://radbots.com/documentation/developers')}
												{this.renderTextInput('Context', 'context', 'https://radbots.com/documentation/developers')}
												{this.renderTextInput('Persona Id', 'personaId', 'https://radbots.com/documentation/developers')}
												{this.renderTextInput('Tags', 'tags', 'https://radbots.com/documentation/developers')}
												{this.renderTextInput('Intent', 'intent', 'https://radbots.com/documentation/developers')}
												{this.renderSaveButton()}
										</div>
								</div>
						</Form>
				)
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

		renderErrorAlert() {
				return (
						<Alert bsStyle="danger" onDismiss={this.handleDismissError}>
								<h4>An error occurred during communication with Radbots</h4>
								<p>Details: {this.state.error}</p>
						</Alert>
				)
		}

		renderAllContent() {
				return <div>
						{this.state.error ? this.renderErrorAlert() : null}
						{this.renderUnsavedAlert()}
						{this.renderMessageAlert()}
						{this.renderForm()}
				</div>
		}

		render() {
				return this.state.loading ? null : this.renderAllContent()
		}
}
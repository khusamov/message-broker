import {jest} from '@jest/globals'
import {EventEmitter} from 'events'
import {IMessage, MessageEmitter} from 'khusamov-message-emitter'
import {MessageBroker} from './MessageBroker'

describe('MessageBroker', () => {
	test('publish', () => {
		const messageBroker = new MessageBroker(new MessageEmitter(new EventEmitter))
		class UserMessage implements IMessage {}
		const message = new UserMessage
		messageBroker.publish(message)
		expect(messageBroker.messageQueue).toContain(message)
	})
	test('emit', () => {
		const listener = jest.fn()
		const messageBroker = new MessageBroker(new MessageEmitter(new EventEmitter))
		class UserMessage implements IMessage {}
		messageBroker.messageEmitter.on(UserMessage, listener)
		const message = new UserMessage
		messageBroker.publish(message)
		messageBroker.emit()
		expect(messageBroker.messageQueue).not.toContain(message)
		expect(listener).toHaveBeenCalled()
	})
})

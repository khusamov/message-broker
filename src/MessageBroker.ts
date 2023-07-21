import {IMessage, MessageEmitter, IMessageConstructor} from 'khusamov-message-emitter'

export class MessageBroker {
	private _messageQueue: IMessage[] = []

	private clearMessageQueue() {
		this._messageQueue = []
	}

	public get messageQueue() {
		return this._messageQueue
	}

	public constructor(
		public readonly messageEmitter: MessageEmitter<IMessage>
	) {}

	public publish(...message: IMessage[]) {
		this.messageQueue.push(...message)
	}

	public emit() {
		for (const message of this.messageQueue) {
			this.messageEmitter.emit(message)
		}
		this.clearMessageQueue()
	}

	/**
	 * Получить сообщение из очереди или дождаться его первого появления в очереди.
	 * @param {IMessageConstructor} MessageClass
	 * @returns {Promise<IMessage>}
	 */
	public async awaitMessage<M extends IMessage>(MessageClass: IMessageConstructor<M>): Promise<M> {
		const message = this.messageQueue.find((message: IMessage): message is M => message instanceof MessageClass)
		return (
			message
				? message
				: await new Promise<M>(resolve => this.messageEmitter.once(MessageClass, resolve))
		)
	}
}

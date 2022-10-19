/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { LogSpan } from './checkout-logger';
import * as logger from './checkout-logger';

describe('Logger', () => {
    // TODO: add mockups

    it('without span', () => {
        describe('debug works', () => {
            logger.debug('test', 'message', logger.LogGroup.Technical);
        });
        describe('warn works', () => {
            logger.warn('test', 'message', logger.LogGroup.Technical, 'user', { foo: 'bar' });
        });
        describe('info works', () => {
            logger.info('test', 'message', logger.LogGroup.Technical, 'user', { foo: 'bar' });
        });
        describe('error works', () => {
            logger.error('test', 'message', logger.LogGroup.Technical, 'user');
        });
        describe('circular reference works', () => {
            // eslint-disable-next-line functional/prefer-readonly-type
            const circular: { [key: string]: any } = {
                foo: 'bar',
                itself: {}
            };
            circular.itself = circular;
            logger.error('test', 'message', logger.LogGroup.Technical, 'user', circular);
        });
    });

    it('with span', () => {
        describe('debug works', () => {
            const span: LogSpan = new logger.LogSpan('fake-id');
            span.debug('test', 'message');
        });
        describe('warn works', () => {
            const span: LogSpan  = new logger.LogSpan('fake-id');
            span.warn('test', 'message', logger.LogGroup.Session, 'user', { foo: 'bar' });
        });
        describe('info works', () => {
            const span: LogSpan  = new logger.LogSpan('fake-id');
            span.info('test', 'message', logger.LogGroup.Session, 'user');
        });
        describe('error works', () => {
            const span: LogSpan  = new logger.LogSpan('fake-id');
            span.error('test', 'message', logger.LogGroup.Session);
        });

    });

    describe('with', () => {
        it('Error meta', () => {
            const span: LogSpan  = new logger.LogSpan('fake-id');
            try {
                throw new Error('Error');
            } catch (e) {
                span.error('test', 'message', logger.LogGroup.Technical, undefined, e);
            }
        });

        it('object meta', () => {
            const span: LogSpan  = new logger.LogSpan('fake-id');
            span.error('test', 'message', logger.LogGroup.Technical, undefined, {
                metaKey: {
                    metaValue: 'test'
                }
            });
        });

        it('string meta', () => {
            const span: LogSpan  = new logger.LogSpan('fake-id');
            span.error('test', 'message', logger.LogGroup.Technical, undefined, 'string-meta');
        });
    });
});

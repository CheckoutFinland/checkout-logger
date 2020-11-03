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
        describe('circular meta works', () => {
            const circularObject: {[key: string]: unknown} = {
                foo: 'bar',
                circle: {}
            };
            circularObject.circle = circularObject;
            logger.error('test', 'message', logger.LogGroup.Technical, 'user', circularObject);
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

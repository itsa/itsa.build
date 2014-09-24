/*global describe, it */
"use strict";
var expect = require('chai').expect;
var Parcela = require('../parcela.js');

describe('Integration test, are they available where they should?', function () {
	it('idGenerator', function () {
		expect(Parcela.idGenerator('integration', 500)).be.equal('integration-500');
	});
	it('typeOf', function () {
		expect(Parcela.typeOf([])).be.equal('array');
	});
	it('io', function () {
		expect(Parcela.IO._createXHR).be.a('function');
	});
	it('event', function () {
		expect(Parcela.Event).be.an('object');
	});
	it('event-emitter', function () {
		expect(Parcela.Event.emitter).be.a('function');
	});
	it('event-listener', function () {
		expect(Parcela.Event.listener).be.an('object');
	});
	it('promise-ext', function () {
		expect(Promise.finishAll).be.a('function');
	});
	it('lang: rbind', function () {
		expect(Function.prototype.rbind).be.a('function');
	});
	it('timers', function () {
		expect(Parcela.later).be.a('function');
	});
	it('parcel', function () {
		expect(Parcela.Parcel).be.a('function');
	});
	it('vdom', function () {
		expect(Parcela.Parcel.vNode).be.a('function');
		expect(Parcela.render).be.a('function');
	});
	it('timers:asyncfunc emitted after async', function (done) {
		Parcela.Event.after('timers:asyncfunc', function() {
			done();
		});
		// calling async() should emit the event 'timers:asyncfunc',
		// which is a `dummy`-event which will re-render the dDOM
		Parcela.async(function() {});
	});

});

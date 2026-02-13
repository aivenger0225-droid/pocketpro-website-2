import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackEvent, trackPageView, trackButtonClick, trackFormSubmit, trackConversion } from './seo';

describe('SEO Tracking Functions', () => {
  beforeEach(() => {
    // 模擬 Google Analytics gtag 函數
    (window as any).gtag = vi.fn();
    (window as any).GA_ID = 'G-P5Z1KYS7GL';
  });

  it('should track events with gtag', () => {
    trackEvent('test_event', { test_param: 'value' });
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'test_event', { test_param: 'value' });
  });

  it('should track page views', () => {
    trackPageView('/test-page', 'Test Page');
    expect((window as any).gtag).toHaveBeenCalledWith('config', 'G-P5Z1KYS7GL', {
      page_path: '/test-page',
      page_title: 'Test Page',
    });
  });

  it('should track button clicks', () => {
    trackButtonClick('submit_button', 'contact_form');
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'button_click', {
      button_name: 'submit_button',
      button_category: 'contact_form',
    });
  });

  it('should track form submissions', () => {
    trackFormSubmit('contact_form');
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'form_submit', {
      form_name: 'contact_form',
    });
  });

  it('should track conversions with value', () => {
    trackConversion('phone_call', 1);
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'conversion', {
      conversion_type: 'phone_call',
      value: 1,
    });
  });

  it('should track conversions without value', () => {
    trackConversion('contact_form_submit');
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'conversion', {
      conversion_type: 'contact_form_submit',
    });
  });
});

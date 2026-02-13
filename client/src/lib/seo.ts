/**
 * SEO 優化工具函數
 * 用於動態更新頁面的 Meta 標籤和追蹤事件
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  canonicalUrl?: string;
}

/**
 * 更新頁面 Meta 標籤
 */
export function updateSEOMetadata(metadata: SEOMetadata) {
  // 更新 title
  document.title = metadata.title;

  // 更新或創建 description meta 標籤
  updateMetaTag('name', 'description', metadata.description);

  // 更新或創建 keywords meta 標籤
  if (metadata.keywords) {
    updateMetaTag('name', 'keywords', metadata.keywords);
  }

  // 更新 Open Graph 標籤
  if (metadata.ogImage) {
    updateMetaTag('property', 'og:image', metadata.ogImage);
  }

  if (metadata.ogUrl) {
    updateMetaTag('property', 'og:url', metadata.ogUrl);
  }

  if (metadata.ogType) {
    updateMetaTag('property', 'og:type', metadata.ogType);
  }

  // 更新 Canonical 標籤
  if (metadata.canonicalUrl) {
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = metadata.canonicalUrl;
  }
}

/**
 * 更新或創建 Meta 標籤
 */
function updateMetaTag(
  attribute: 'name' | 'property',
  attributeValue: string,
  content: string
) {
  let metaTag = document.querySelector(
    `meta[${attribute}="${attributeValue}"]`
  ) as HTMLMetaElement;

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, attributeValue);
    document.head.appendChild(metaTag);
  }

  metaTag.content = content;
}

/**
 * 追蹤用戶事件（Google Analytics）
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }
}

/**
 * 追蹤頁面瀏覽
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', (window as any).GA_ID || '', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

/**
 * 追蹤按鈕點擊
 */
export function trackButtonClick(buttonName: string, buttonCategory: string) {
  trackEvent('button_click', {
    button_name: buttonName,
    button_category: buttonCategory,
  });
}

/**
 * 追蹤表單提交
 */
export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', {
    form_name: formName,
  });
}

/**
 * 追蹤轉化事件
 */
export function trackConversion(conversionType: string, value?: number) {
  trackEvent('conversion', {
    conversion_type: conversionType,
    ...(value && { value }),
  });
}

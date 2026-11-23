<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="id">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>XML Sitemap | AKV - Arah Karya Visual</title>
        <style>
          body { font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif; background: #F4F8FF; color: #0D1B3D; margin: 0; padding: 32px 20px; }
          .wrap { max-width: 960px; margin: 0 auto; background: #FFFFFF; border: 1px solid #DCEBFF; border-radius: 20px; padding: 28px 32px; box-shadow: 0 6px 24px -6px rgba(18, 39, 94, 0.12); }
          h1 { margin: 0 0 8px; font-size: 24px; color: #0D1B3D; }
          .badge { display: inline-block; background: #DCEBFF; color: #0B5CFF; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px; }
          p { margin: 0 0 20px; color: #12275E; font-size: 14px; line-height: 1.6; }
          a { color: #0B5CFF; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; padding: 12px 10px; border-bottom: 2px solid #DCEBFF; color: #1E3C8F; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
          td { padding: 12px 10px; border-bottom: 1px solid #F4F8FF; vertical-align: top; }
          tr:hover td { background: #F4F8FF; }
          .sub { margin-top: 6px; padding-left: 14px; color: #12275E; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <span class="badge">AKV - Arah Karya Visual</span>
          <h1>XML Sitemap</h1>
          <p>
            Peta situs resmi <strong>AKV (Arah Karya Visual)</strong> oleh Zakaria Mujur Prasetyo &amp; Lia Nur Khasanah untuk membantu mesin pencari mengindeks halaman dan aset visual secara optimal.
          </p>

          <xsl:if test="sitemap:sitemapindex">
            <table>
              <thead>
                <tr>
                  <th>Sitemap</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <xsl:if test="sitemap:urlset">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Priority</th>
                  <th>Change Freq</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                      <xsl:if test="image:image">
                        <div class="sub">
                          <xsl:for-each select="image:image">
                            <div>Image: <a href="{image:loc}"><xsl:value-of select="image:title"/></a></div>
                          </xsl:for-each>
                        </div>
                      </xsl:if>
                    </td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

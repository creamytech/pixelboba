import { prisma } from '@/lib/prisma';

export interface LayoutStyle {
  transform?: string;
  width?: string;
  height?: string;
  opacity?: number;
  zIndex?: number;
}

/**
 * Get layout settings for a specific element
 * Returns inline styles to apply to the element
 */
export async function getLayoutStyles(elementId: string): Promise<LayoutStyle> {
  try {
    const setting = await prisma.layoutSetting.findUnique({
      where: { elementId },
    });

    if (!setting) {
      return {}; // Return empty object if no custom settings
    }

    const transforms: string[] = [];

    // Add translate if position is set
    if (setting.positionX !== 0 || setting.positionY !== 0) {
      transforms.push(`translate(${setting.positionX}px, ${setting.positionY}px)`);
    }

    // Add scale if not 1.0
    if (setting.scale !== 1.0) {
      transforms.push(`scale(${setting.scale})`);
    }

    // Add rotation if set
    if (setting.rotation !== 0) {
      transforms.push(`rotate(${setting.rotation}deg)`);
    }

    const styles: LayoutStyle = {};

    if (transforms.length > 0) {
      styles.transform = transforms.join(' ');
    }

    if (setting.width) {
      styles.width = `${setting.width}px`;
    }

    if (setting.height) {
      styles.height = `${setting.height}px`;
    }

    if (setting.opacity !== 1.0) {
      styles.opacity = setting.opacity;
    }

    if (setting.zIndex !== 0) {
      styles.zIndex = setting.zIndex;
    }

    return styles;
  } catch (error) {
    console.error('Error fetching layout settings:', error);
    return {}; // Return empty object on error
  }
}

/**
 * Get layout class names for Tailwind CSS
 * (For static positioning based on database values)
 */
export async function getLayoutClasses(elementId: string): Promise<string> {
  try {
    const setting = await prisma.layoutSetting.findUnique({
      where: { elementId },
    });

    if (!setting) {
      return '';
    }

    const classes: string[] = [];

    // Note: This is for static classes only
    // Dynamic values should use inline styles via getLayoutStyles()

    return classes.join(' ');
  } catch (error) {
    console.error('Error fetching layout settings:', error);
    return '';
  }
}

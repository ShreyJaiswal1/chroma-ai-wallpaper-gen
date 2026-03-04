import { Dialog } from '@/src/shared/ui/organisms/dialog';
import { useEffect } from 'react';
import { View } from 'react-native';

/**
 * Auto-triggers a Reacticx Dialog on mount.
 * Used to programmatically open dialogs without user interaction.
 */
export const AutoTrigger = () => {
  return (
    <Dialog.Trigger asChild>
      <AutoClickView />
    </Dialog.Trigger>
  );
};

const AutoClickView = ({ onPress }: any) => {
  useEffect(() => {
    if (onPress) {
      setTimeout(onPress, 50);
    }
  }, [onPress]);
  return <View style={{ display: 'none' }} />;
};

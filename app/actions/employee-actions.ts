"use server";

import { revalidatePath } from "next/cache";

import { upsertEmployeeAction } from "@/lib/data";
import type { EmployeeActionStatus } from "@/types";

interface SaveEmployeeActionInput {
  employeeId: string;
  status: EmployeeActionStatus;
  note: string;
  ownerName: string;
}

export async function saveEmployeeAction(input: SaveEmployeeActionInput) {
  try {
    const action = await upsertEmployeeAction(input);

    revalidatePath("/employees");
    revalidatePath(`/employees/${input.employeeId}`);
    revalidatePath("/");

    return {
      success: true,
      action
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "조치 상태를 저장하지 못했습니다. Supabase 설정을 다시 확인해 주세요."
    };
  }
}
